import React from "react";
import "./AccountView.css"

export default function AccountView({email, name, token, templativeRootDirectoryPath}) {
    
    const hourglass = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-hourglass-split" viewBox="0 0 16 16">
        <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
    </svg>
    
    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return "Morning";
        } else if (hour < 18) {
            return "Afternoon";
        } else {
            return "Evening";
        }
    };
    const advice = [
        "Start with a clear core mechanic that players can understand in 30 seconds",
        "Playtest early and often - even with paper prototypes",
        "Make sure every component serves a purpose; remove anything that doesn't add to the experience",
        "Design for your target audience's attention span and complexity tolerance",
        "Ensure meaningful choices exist at every decision point",
        "Avoid player elimination unless it's central to the game's theme",
        "Balance randomness with strategy - too much of either kills engagement",
        "Create multiple paths to victory to increase replayability",
        "Make the first turn immediately engaging, not just setup",
        "Design clear win conditions that players can track throughout the game",
        "Use asymmetric player powers to create unique experiences",
        "Implement catch-up mechanics to prevent runaway leaders",
        "Keep downtime between turns minimal",
        "Make failure interesting and recoverable, not devastating",
        "Design components that are intuitive to use and manipulate",
        "Create tension through scarcity of resources or opportunities",
        "Ensure the game scales properly for different player counts",
        "Use iconography consistently throughout all game materials",
        "Make the game state visible and readable at all times",
        "Design for both casual and competitive play styles",
        "Create moments of player interaction and engagement",
        "Avoid analysis paralysis by limiting decision complexity",
        "Make dice rolls matter but not determine the entire outcome",
        "Design clear turn structures that players can easily follow",
        "Use player boards to organize personal game states",
        "Create satisfying feedback loops for player actions",
        "Balance short-term tactics with long-term strategy",
        "Make setup and teardown as quick and simple as possible",
        "Design components that clearly communicate their function",
        "Create natural break points for longer games",
        "Use color coding effectively while considering colorblind accessibility",
        "Make sure all players stay engaged throughout the entire game",
        "Design for storage and portability if targeting casual markets",
        "Create clear cause-and-effect relationships between actions and outcomes",
        "Use familiar themes to help players understand unfamiliar mechanics",
        "Balance luck mitigation options with acceptance of randomness",
        "Design intuitive scoring systems that players can calculate mentally",
        "Create moments of suspense and revelation",
        "Make player interaction meaningful, not just incidental",
        "Design for different skill levels to play together competitively",
        "Use negative space effectively in your component design",
        "Create emergent gameplay through simple rule interactions",
        "Make sure the game works at minimum and maximum player counts",
        "Design clear visual hierarchies on cards and boards",
        "Implement flexible turn orders when beneficial",
        "Create satisfying combos and synergies between game elements",
        "Make resource management engaging, not tedious",
        "Design for accessibility including visual, motor, and cognitive considerations",
        "Create natural game rhythms with tension and release",
        "Make sure advanced strategies emerge from basic rules",
        "Use player elimination alternatives like reduced actions or comeback mechanics",
        "Design components that age well with repeated play",
        "Create clear information hierarchies on all game materials",
        "Balance immediate rewards with delayed gratification",
        "Make sure every player has agency in determining their fate",
        "Design for easy rules explanation and teaching",
        "Create satisfying moments of discovery and revelation",
        "Use prototype materials that simulate final component feel",
        "Make sure dice provide excitement, not frustration",
        "Design clear visual feedback for successful actions",
        "Create multiple viable strategies of roughly equal power",
        "Make turn order matter but not dominate outcomes",
        "Design components that stack, sort, and store efficiently",
        "Use consistent terminology throughout all game materials",
        "Create natural stopping points in longer games",
        "Make sure bluffing and hidden information serve the game's purpose",
        "Design for various group dynamics and social preferences",
        "Create satisfying endgame sequences that feel climactic",
        "Make sure cards and tokens are durable enough for repeated use",
        "Design clear win/loss moments that feel earned",
        "Use playtesting to identify and fix dominant strategies",
        "Create meaningful trade-offs in every major decision",
        "Make sure the game teaches itself through play",
        "Design for both quick learning and deep mastery",
        "Create moments where players must adapt their strategies",
        "Make sure random events feel thematic and logical",
        "Design clear visual distinctions between different game elements",
        "Create satisfying progression arcs within single games",
        "Make sure player count changes feel intentional, not accidental",
        "Design components that communicate their rarity or importance",
        "Create natural conversation points during gameplay",
        "Make sure the game rewards good play more than good luck",
        "Design for the emotional experience you want players to have",
        "Create clear timing windows for player interactions",
        "Make sure every game element has a clear owner and location",
        "Design rules that can be explained without referring to the rulebook",
        "Create satisfying moments of tension and resolution",
        "Make sure advanced variants feel like natural extensions",
        "Design for graceful handling of player mistakes",
        "Create clear visual languages for different types of game information",
        "Make sure the game works with its intended play time",
        "Design components that feel good to manipulate physically",
        "Create meaningful choices at multiple time scales",
        "Make sure the game rewards planning but allows for adaptation",
        "Design clear consequences for different types of player actions",
        "Create satisfying endgame triggers that feel inevitable yet uncertain",
        "Make sure solo variants capture the multiplayer game's essence",
        "Design for easy variant rules and house rules adoption",
        "Create clear visual hierarchies that guide player attention",
        "Make sure dice alternatives exist when randomness feels unfair",
        "Design components that clearly indicate their game state",
        "Create natural tutorial progressions for new players",
        "Make sure player interaction scales appropriately with player count",
        "Design for both analytical and intuitive decision-making styles",
        "Create satisfying moments of risk and reward",
        "Make sure the game's complexity budget is spent wisely",
        "Design clear feedback systems for player progress",
        "Create multiple layers of strategy that reveal themselves over time",
        "Make sure cooperative elements enhance rather than complicate competitive ones",
        "Design for memorable moments that players will discuss afterward"
      ]
      const chosenAdvice = advice[Math.floor(Math.random() * advice.length)];
    const timeOfDay = getTimeOfDay();
    const lightbulbIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lightbulb-fill account-advice-icon" viewBox="0 0 16 16">
        <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5"/>
    </svg>
    return <div className="account-body">
        <div className="account-content">
            <h1>Profile <span className="time-of-day">Good {timeOfDay}.</span></h1>
            <p className="account-email">{email}</p>
            <div className="time-saved">
                <div className="time-saved-icon">
                    {hourglass}
                </div>
                <div className="time-saved-content">
                    <h2>Time saved</h2>
                    <p>100 hours</p>
                </div>
            </div>
            <div className="account-advice-container">
                <p className="account-advice">{lightbulbIcon} {chosenAdvice}.</p>
            </div>
        </div>
        
    </div>
    
}