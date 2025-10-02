import { NotificationDispatcher } from '../src/lib/NotificationDispatcher';
import { NotificationChannel } from '../src/channels/NotificationChannel';
import { MetricTracker } from '../src/services/MetricTracker';
import { ChannelTriggerTime } from '../src/constants/constant';

// Mock dependencies
jest.mock('../src/channels/NotificationChannel');
jest.mock('../src/services/MetricTracker');
jest.mock('../src/utils/timeUtils', () => ({
    shouldSendNow: jest.fn()
}));

describe('NotificationDispatcher', () => {
    let dispatcher: NotificationDispatcher;
    let mockChannels: Record<string, jest.Mocked<NotificationChannel>>;
    let mockMetrics: jest.Mocked<MetricTracker>;
    let mockShouldSendNow: jest.MockedFunction<any>;
    let setIntervalSpy: jest.SpyInstance;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Create mock channels
        mockChannels = {
            email: {
                send: jest.fn()
            } as any,
            slack: {
                send: jest.fn()
            } as any,
            sms: {
                send: jest.fn()
            } as any
        };

        // Create mock metrics
        mockMetrics = {
            incrementEventReceived: jest.fn(),
            incrementNotificationSent: jest.fn(),
            incrementFailure: jest.fn(),
            incrementRetry: jest.fn(),
            display: jest.fn()
        } as any;

        // Mock shouldSendNow function
        const { shouldSendNow } = require('../src/utils/timeUtils');
        mockShouldSendNow = shouldSendNow;

        // Mock setInterval to prevent actual timer execution
        setIntervalSpy = jest.spyOn(global, 'setInterval').mockImplementation(() => {
            return {} as any; // Return a mock timer ID
        });

        // Create dispatcher instance
        dispatcher = new NotificationDispatcher(
            mockChannels,
            mockMetrics,
            3, // maxRetries
            1000, // initialBackoffMs
            100 // batchIntervalMs - short for testing
        );

        // Mock timers
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
        setIntervalSpy.mockRestore();
    });

    describe('constructor', () => {
        it('should initialize with correct default values', () => {
            expect(dispatcher).toBeInstanceOf(NotificationDispatcher);
        });

        it('should start batch processor', () => {
            // Verify that setInterval was called
            expect(setIntervalSpy).toHaveBeenCalled();
        });
    });

    describe('dispatch', () => {
        it('should add message to queue and increment event received metric', async () => {
            mockShouldSendNow.mockReturnValue(false);

            await dispatcher.dispatch('email', 'user@example.com', 'Test message', ChannelTriggerTime.IMMEDIATE);

            expect(mockMetrics.incrementEventReceived).toHaveBeenCalled();
        });

        it('should use default trigger time when not provided', async () => {
            mockShouldSendNow.mockReturnValue(false);

            await dispatcher.dispatch('email', 'user@example.com', 'Test message');

            expect(mockMetrics.incrementEventReceived).toHaveBeenCalled();
        });
    });

    describe('sendWithRetry', () => {
        it('should send message successfully on first attempt', async () => {
            mockChannels.email.send.mockResolvedValue(true);

            await (dispatcher as any).sendWithRetry('email', 'user@example.com', 'Test message');

            expect(mockChannels.email.send).toHaveBeenCalledTimes(1);
            expect(mockChannels.email.send).toHaveBeenCalledWith('user@example.com', 'Test message');
            expect(mockMetrics.incrementNotificationSent).toHaveBeenCalledWith('email');
            expect(mockMetrics.incrementFailure).not.toHaveBeenCalled();
        });

        it('should retry on failure and eventually succeed', async () => {
            mockChannels.email.send
                .mockResolvedValueOnce(false) // First attempt fails
                .mockResolvedValueOnce(true); // Second attempt succeeds

            // Mock sleep to avoid actual delays
            const sleepSpy = jest.spyOn(dispatcher as any, 'sleep').mockResolvedValue(undefined);

            await (dispatcher as any).sendWithRetry('email', 'user@example.com', 'Test message');

            expect(mockChannels.email.send).toHaveBeenCalledTimes(2);
            expect(mockMetrics.incrementFailure).toHaveBeenCalledTimes(1);
            expect(mockMetrics.incrementRetry).toHaveBeenCalledTimes(1);
            expect(mockMetrics.incrementNotificationSent).toHaveBeenCalledWith('email');
            
            sleepSpy.mockRestore();
        }, 10000);

        it('should fail permanently after max retries', async () => {
            mockChannels.email.send.mockResolvedValue(false); // All attempts fail

            // Mock sleep to avoid actual delays
            const sleepSpy = jest.spyOn(dispatcher as any, 'sleep').mockResolvedValue(undefined);

            await (dispatcher as any).sendWithRetry('email', 'user@example.com', 'Test message');

            expect(mockChannels.email.send).toHaveBeenCalledTimes(3); // Initial + 2 retries
            expect(mockMetrics.incrementFailure).toHaveBeenCalledTimes(3);
            expect(mockMetrics.incrementRetry).toHaveBeenCalledTimes(2);
            expect(mockMetrics.incrementNotificationSent).not.toHaveBeenCalled();
            
            sleepSpy.mockRestore();
        }, 10000);

        it('should handle non-existent channel gracefully', async () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            await (dispatcher as any).sendWithRetry('nonexistent', 'user@example.com', 'Test message');

            expect(consoleSpy).toHaveBeenCalledWith("Channel 'nonexistent' not configured.");
            expect(mockMetrics.incrementNotificationSent).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        it('should implement exponential backoff', async () => {
            mockChannels.email.send.mockResolvedValue(false);

            const sleepSpy = jest.spyOn(dispatcher as any, 'sleep').mockResolvedValue(undefined);

            await (dispatcher as any).sendWithRetry('email', 'user@example.com', 'Test message');

            expect(sleepSpy).toHaveBeenCalledTimes(2); // 2 retries
            expect(sleepSpy).toHaveBeenNthCalledWith(1, 1000); // First backoff: 1000ms
            expect(sleepSpy).toHaveBeenNthCalledWith(2, 2000); // Second backoff: 2000ms

            sleepSpy.mockRestore();
        }, 10000);
    });

    describe('processBatch', () => {
        it('should process messages that are ready to send', async () => {
            mockShouldSendNow.mockReturnValue(true);
            mockChannels.email.send.mockResolvedValue(true);

            // Add messages to queue
            await dispatcher.dispatch('email', 'user1@example.com', 'Message 1');
            await dispatcher.dispatch('email', 'user2@example.com', 'Message 2');

            // Process batch
            await (dispatcher as any).processBatch();

            expect(mockChannels.email.send).toHaveBeenCalledTimes(2);
            expect(mockChannels.email.send).toHaveBeenCalledWith('user1@example.com', 'Message 1');
            expect(mockChannels.email.send).toHaveBeenCalledWith('user2@example.com', 'Message 2');
        });

        it('should not process messages that are not ready', async () => {
            mockShouldSendNow.mockReturnValue(false);

            // Add messages to queue
            await dispatcher.dispatch('email', 'user@example.com', 'Message 1');

            // Process batch
            await (dispatcher as any).processBatch();

            expect(mockChannels.email.send).not.toHaveBeenCalled();
        });

        it('should handle empty queue', async () => {
            await (dispatcher as any).processBatch();

            expect(mockChannels.email.send).not.toHaveBeenCalled();
        });

        it('should remove processed messages from queue', async () => {
            mockShouldSendNow.mockReturnValue(true);
            mockChannels.email.send.mockResolvedValue(true);

            // Add messages to queue
            await dispatcher.dispatch('email', 'user@example.com', 'Message 1');

            // Process batch
            await (dispatcher as any).processBatch();

            // Process again - should not find any messages
            await (dispatcher as any).processBatch();

            expect(mockChannels.email.send).toHaveBeenCalledTimes(1);
        });

        it('should keep unprocessed messages in queue', async () => {
            mockShouldSendNow.mockReturnValue(false);

            // Add messages to queue
            await dispatcher.dispatch('email', 'user@example.com', 'Message 1');

            // Process batch
            await (dispatcher as any).processBatch();

            // Change shouldSendNow to true and process again
            mockShouldSendNow.mockReturnValue(true);
            mockChannels.email.send.mockResolvedValue(true);
            await (dispatcher as any).processBatch();

            expect(mockChannels.email.send).toHaveBeenCalledTimes(1);
        });
    });

    describe('batch processing', () => {
        it('should process batch when manually triggered', async () => {
            mockShouldSendNow.mockReturnValue(true);
            mockChannels.email.send.mockResolvedValue(true);

            await dispatcher.dispatch('email', 'user@example.com', 'Message 1');

            // Manually trigger batch processing
            await (dispatcher as any).processBatch();

            expect(mockChannels.email.send).toHaveBeenCalled();
        });

        it('should start batch processor on initialization', () => {
            // Verify that setInterval was called during construction
            expect(setIntervalSpy).toHaveBeenCalled();
        });
    });

    describe('sleep method', () => {
        it('should sleep for specified duration', async () => {
            // Mock setTimeout to avoid actual delays
            const setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn: any) => {
                fn(); // Execute immediately
                return {} as any;
            });

            await (dispatcher as any).sleep(100);

            expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);
            
            setTimeoutSpy.mockRestore();
        });
    });

    describe('error handling', () => {
        it('should propagate channel send errors', async () => {
            mockShouldSendNow.mockReturnValue(true);
            mockChannels.email.send.mockRejectedValue(new Error('Network error'));

            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            await dispatcher.dispatch('email', 'user@example.com', 'Message 1');
            
            // The method should throw the error from channel send
            await expect((dispatcher as any).processBatch()).rejects.toThrow('Network error');

            consoleSpy.mockRestore();
        });
    });

    describe('metrics integration', () => {
        it('should increment correct metrics on success', async () => {
            mockShouldSendNow.mockReturnValue(true);
            mockChannels.email.send.mockResolvedValue(true);

            await dispatcher.dispatch('email', 'user@example.com', 'Message 1');
            await (dispatcher as any).processBatch();

            expect(mockMetrics.incrementEventReceived).toHaveBeenCalled();
            expect(mockMetrics.incrementNotificationSent).toHaveBeenCalledWith('email');
        });

        it('should increment correct metrics on failure', async () => {
            mockShouldSendNow.mockReturnValue(true);
            mockChannels.email.send.mockResolvedValue(false);

            // Mock sleep to avoid actual delays
            const sleepSpy = jest.spyOn(dispatcher as any, 'sleep').mockResolvedValue(undefined);

            await dispatcher.dispatch('email', 'user@example.com', 'Message 1');
            await (dispatcher as any).processBatch();

            expect(mockMetrics.incrementEventReceived).toHaveBeenCalled();
            expect(mockMetrics.incrementFailure).toHaveBeenCalled();
            expect(mockMetrics.incrementRetry).toHaveBeenCalled();
            
            sleepSpy.mockRestore();
        }, 10000);
    });
});
