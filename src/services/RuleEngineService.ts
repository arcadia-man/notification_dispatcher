import { engine } from "../lib/RulesEngine";

export class RuleEngineService {
    /**
     * Validate event data against the rules engine.
     * Returns matched events or null if any error occurs.
     *
     * @param {EventFact} data - The event/fact object to validate
     * @returns {Promise<any[] | null>} - Array of triggered events or null
     */
    async validateByRuleEngine(data: any): Promise<any[]> {
        try {
            const results = await engine.run(data);
            return results.events; // array of triggered events with type & params.template
        } catch (err) {
            console.log(err)
            return [];
        }
    }

}