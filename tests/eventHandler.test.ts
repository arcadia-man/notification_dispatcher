import EventHandlerService from '../src/services/EventHandlerService';
import { UserService } from '../src/services/UserService';
import { NotificationDispatcher } from '../src/lib/NotificationDispatcher';
import { RuleEngineService } from '../src/services/RuleEngineService';
import { User } from '../src/interfaces/user';
import { Event } from '../src/interfaces/event';
import { Channel, EventType, ChannelTriggerTime } from '../src/constants/constant';

// Mock dependencies
jest.mock('../src/services/UserService');
jest.mock('../src/lib/NotificationDispatcher');
jest.mock('../src/services/RuleEngineService');

describe('EventHandlerService', () => {
    let eventHandlerService: EventHandlerService;
    let mockUserService: jest.Mocked<UserService>;
    let mockDispatcher: jest.Mocked<NotificationDispatcher>;
    let mockRuleEngineService: jest.Mocked<RuleEngineService>;

    const mockUser: User = {
        userId: 'user123',
        contact: {
            email_id: 'user@example.com',
            username: 'testuser',
            phone_no: '+1234567890',
            slack_id: 'U123456'
        },
        preferences: {
            [EventType.ORDER_PLACED]: [Channel.EMAIL, Channel.SLACK],
            [EventType.PASSWORD_RESET]: [Channel.EMAIL],
            [EventType.ADVERTISEMENT]: [Channel.SLACK]
        },
        order: [],
        advertisement: []
    };

    const mockEvent: Event = {
        eventType: EventType.ORDER_PLACED,
        userId: 'user123',
        payload: { orderId: 'order123', amount: 100 }
    };

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Create mocked instances
        mockUserService = new UserService() as jest.Mocked<UserService>;
        mockDispatcher = new NotificationDispatcher({}, {} as any) as jest.Mocked<NotificationDispatcher>;
        mockRuleEngineService = new RuleEngineService() as jest.Mocked<RuleEngineService>;

        // Create service instance
        eventHandlerService = new EventHandlerService(
            mockUserService,
            mockDispatcher,
            mockRuleEngineService
        );
    });

    describe('generateMessage', () => {
        it('should generate message with correct template replacements', () => {
            const template = 'Hello {{username}}, your {{eventType}} order {{payload}} is confirmed!';
            const expectedMessage = 'Hello testuser, your orderPlaced order {"orderId":"order123","amount":100} is confirmed!';

            // Access private method through any casting for testing
            const result = (eventHandlerService as any).generateMessage(template, mockUser, mockEvent);

            expect(result).toBe(expectedMessage);
        });

        it('should handle missing username gracefully', () => {
            const userWithoutUsername = { ...mockUser, contact: { ...mockUser.contact, username: undefined } };
            const template = 'Hello {{username}}, your order is ready!';
            const expectedMessage = 'Hello User, your order is ready!';

            const result = (eventHandlerService as any).generateMessage(template, userWithoutUsername, mockEvent);

            expect(result).toBe(expectedMessage);
        });
    });

    describe('dispatchMessage', () => {
        it('should dispatch messages for all rule results', async () => {
            const mockRulesRes = [
                {
                    params: {
                        template: 'Order {{eventType}} confirmed for {{username}}',
                        trigger: ChannelTriggerTime.IMMEDIATE
                    }
                },
                {
                    params: {
                        template: 'Thank you {{username}} for your {{eventType}}',
                        trigger: ChannelTriggerTime.BUSINESS_HOURS
                    }
                }
            ];

            await (eventHandlerService as any).dispatchMessage(mockRulesRes, mockUser, mockEvent, Channel.EMAIL);

            expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(2);
            expect(mockDispatcher.dispatch).toHaveBeenCalledWith(
                Channel.EMAIL,
                'user@example.com',
                'Order orderPlaced confirmed for testuser',
                ChannelTriggerTime.IMMEDIATE
            );
            expect(mockDispatcher.dispatch).toHaveBeenCalledWith(
                Channel.EMAIL,
                'user@example.com',
                'Thank you testuser for your orderPlaced',
                ChannelTriggerTime.BUSINESS_HOURS
            );
        });

        it('should use default trigger time when not specified', async () => {
            const mockRulesRes = [
                {
                    params: {
                        template: 'Default trigger message'
                    }
                }
            ];

            await (eventHandlerService as any).dispatchMessage(mockRulesRes, mockUser, mockEvent, Channel.SLACK);

            expect(mockDispatcher.dispatch).toHaveBeenCalledWith(
                Channel.SLACK,
                'U123456',
                'Default trigger message',
                ChannelTriggerTime.IMMEDIATE
            );
        });
    });

    describe('handlEvent', () => {
        it('should handle valid event successfully', async () => {
            mockUserService.getUser.mockReturnValue(mockUser);
            mockRuleEngineService.validateByRuleEngine.mockResolvedValue([
                { params: { template: 'Order confirmed', trigger: ChannelTriggerTime.IMMEDIATE } }
            ]);

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            await eventHandlerService.handlEvent(mockEvent);

            expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
            expect(mockRuleEngineService.validateByRuleEngine).toHaveBeenCalledTimes(2); // EMAIL and SLACK
            expect(mockDispatcher.dispatch).toHaveBeenCalledTimes(2);

            consoleSpy.mockRestore();
        });

        it('should handle invalid user', async () => {
            mockUserService.getUser.mockReturnValue(undefined);

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            await eventHandlerService.handlEvent(mockEvent);

            expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
            expect(mockRuleEngineService.validateByRuleEngine).not.toHaveBeenCalled();
            expect(mockDispatcher.dispatch).not.toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith('Invalid User');

            consoleSpy.mockRestore();
        });

        it('should handle user with no preferences for event type', async () => {
            const userWithoutPreferences = {
                ...mockUser,
                preferences: {
                    ...mockUser.preferences,
                    [EventType.ORDER_PLACED]: []
                }
            };
            mockUserService.getUser.mockReturnValue(userWithoutPreferences);

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            await eventHandlerService.handlEvent(mockEvent);

            expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
            expect(mockRuleEngineService.validateByRuleEngine).not.toHaveBeenCalled();
            expect(mockDispatcher.dispatch).not.toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith("User didn't opted for communication");

            consoleSpy.mockRestore();
        });

        it('should handle user with undefined preferences for event type', async () => {
            const userWithoutPreferences = {
                ...mockUser,
                preferences: {
                    ...mockUser.preferences,
                    [EventType.ORDER_PLACED]: undefined as any
                }
            };
            mockUserService.getUser.mockReturnValue(userWithoutPreferences);

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            await eventHandlerService.handlEvent(mockEvent);

            expect(mockUserService.getUser).toHaveBeenCalledWith('user123');
            expect(mockRuleEngineService.validateByRuleEngine).not.toHaveBeenCalled();
            expect(mockDispatcher.dispatch).not.toHaveBeenCalled();
            expect(consoleSpy).toHaveBeenCalledWith("User didn't opted for communication");

            consoleSpy.mockRestore();
        });

        it('should call rule engine with correct data for each preference', async () => {
            mockUserService.getUser.mockReturnValue(mockUser);
            mockRuleEngineService.validateByRuleEngine.mockResolvedValue([]);

            await eventHandlerService.handlEvent(mockEvent);

            expect(mockRuleEngineService.validateByRuleEngine).toHaveBeenCalledTimes(2);

            // Check first call (EMAIL channel)
            expect(mockRuleEngineService.validateByRuleEngine).toHaveBeenCalledWith({
                email_id: 'user@example.com',
                username: 'testuser',
                phone_no: '+1234567890',
                slack_id: 'U123456',
                eventType: EventType.ORDER_PLACED,
                payload: { orderId: 'order123', amount: 100 },
                preference: Channel.EMAIL
            });

            // Check second call (SLACK channel)
            expect(mockRuleEngineService.validateByRuleEngine).toHaveBeenCalledWith({
                email_id: 'user@example.com',
                username: 'testuser',
                phone_no: '+1234567890',
                slack_id: 'U123456',
                eventType: EventType.ORDER_PLACED,
                payload: { orderId: 'order123', amount: 100 },
                preference: Channel.SLACK
            });
        });

        it('should propagate rule engine errors', async () => {
            mockUserService.getUser.mockReturnValue(mockUser);
            mockRuleEngineService.validateByRuleEngine.mockRejectedValue(new Error('Rule engine error'));

            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            // The method should throw the error from rule engine
            await expect(eventHandlerService.handlEvent(mockEvent)).rejects.toThrow('Rule engine error');

            expect(mockRuleEngineService.validateByRuleEngine).toHaveBeenCalledTimes(1);
            expect(mockDispatcher.dispatch).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });
});
