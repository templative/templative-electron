import React from "react"
import gameCrafter from "./Icons/gameCrafter.svg"
import tabletopSimulator from "./Icons/tabletopSimulator.svg"
import tabletopPlayground from "./Icons/tabletopPlayground.svg"
export const TOP_NAVBAR_ITEMS = [
    // {
    //     name:"Plan",
    //     route:"/plan"
    // },
    // {
    //     name:"Prototype",
    //     route:"/create"
    // },
    {
        name:"Create",
        route:"/create",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#efb521" className="bi bi-file-plus-fill" viewBox="0 0 16 16">
            <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0"/>
        </svg>
    },
    {
        name:"Edit",
        route:"/",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#efb521" className="bi bi-pencil-fill" viewBox="0 0 16 16">
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
        </svg>
    },
    {
        name:"Render",
        route:"/render",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#efb521" className="bi bi-palette-fill" viewBox="0 0 16 16">
            <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
        </svg>
    },
    {
        name:"Print",
        route:"/print",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#efb521" className="bi bi-printer-fill" viewBox="0 0 16 16">
            <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
            <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
        </svg>
    },
    // {
    //     name:"Simulator",
    //     route:"/simulator",
    //     svg: <img src={tabletopSimulator}/>
    // },
    {
        name:"Playground",
        route:"/playground",
        svg: <img src={tabletopPlayground}/>
    },
    {
        name:"Upload",
        route:"/upload",
        svg: <img src={gameCrafter}/>
    },
    {
        name:"Feedback",
        route:"/feedback",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#efb521" className="bi bi-question-square-fill" viewBox="0 0 16 16">
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/>
        </svg>
    },
    // {
    //     name:"Animate",
    //     route:"/animate"
    // },
    // {
    //     name:"Market",
    //     route:"/market"
    // },
    // {
    //     name:"Attend",
    //     route:"/market"
    // }
]
