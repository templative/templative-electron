import React from "react"
import FontIcon from "./TopBar/FontIcon.svg?react"
import RulesIcon from "./TopBar/RulesIcon.svg?react"
import LearnIcon from "./TopBar/LearnIcon.svg?react"
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
        name:"Learn",
        route:"learn",
        svg: <LearnIcon className="topbar-icon" />
    },
    {
        name:"Project",
        route:"project",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi topbar-icon bi-file-plus-fill" viewBox="0 0 16 16">
        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M4.5 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1m0 2h7a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5"/>
      </svg>
    },
    {
        name:"Add",
        route:"create",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi topbar-icon bi-file-plus-fill" viewBox="0 0 16 16">
            <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2M8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0"/>
        </svg>
    },
    {
        name:"Edit",
        route:"edit",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi topbar-icon bi-file-text-fill" viewBox="0 0 24 24">
            <path d="M 18,0 H 6 A 3,3 0 0 0 3,3 v 18 a 3,3 0 0 0 3,3 h 12 a 3,3 0 0 0 3,-3 V 3 A 3,3 0 0 0 18,0 M 7.5,6 h 9 a 0.75,0.75 0 0 1 0,1.5 h -9 A 0.75,0.75 0 0 1 7.5,6 M 6.75,9.75 A 0.75,0.75 0 0 1 7.5,9 h 9 a 0.75,0.75 0 0 1 0,1.5 h -9 A 0.75,0.75 0 0 1 6.75,9.75 M 7.5,12 h 9 a 0.75,0.75 0 0 1 0,1.5 h -9 a 0.75,0.75 0 0 1 0,-1.5 m 0,3 H 12 a 0.75,0.75 0 0 1 0,1.5 H 7.5 a 0.75,0.75 0 0 1 0,-1.5"/>
        </svg>
    },
    {
        name:"Fonts",
        route:"font",
        svg: <FontIcon className="topbar-icon" />
    },
    {
        name:"Rules",
        route:"rules",
        svg: <RulesIcon className="topbar-icon" />
    },
    {
        name:"Render",
        route:"render",
        svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi topbar-icon bi-file-image-fill" viewBox="0 0 24 24">
            <path d="m 6,0 h 12 a 3,3 0 0 1 3,3 v 12.4395 l -4.095,-4.095 a 1.5,1.5 0 0 0 -2.28,0.1905 L 11.7915,15.501 9.138,13.908 A 1.5,1.5 0 0 0 7.305,14.133 L 3,18.438 V 3 A 3,3 0 0 1 6,0 m 6.003,8.25 a 2.25,2.25 0 1 0 -4.5,0 2.25,2.25 0 0 0 4.5,0" />
            <path d="M 15.846,12.405 21,17.562 V 21 a 3,3 0 0 1 -3,3 H 6 A 3,3 0 0 1 3,21 v -0.4395 l 5.367,-5.3655 3.84,2.304 3.639,-5.0925 z"/>
        </svg>
    },
    // {
    //     name:"Profile",
    //     route:"account",
    //     svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi topbar-icon bi-person-circle" viewBox="0 0 16 16">
    //         <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
    //         <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
    //     </svg>
    // }
    // {
    //     name:"Find Publishers & Conventions",
    //     route:"map",
    //     svg:  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi topbar-icon bi-globe-americas" viewBox="0 0 16 16">
    //         <path d="M8 0a8 8 0 100 16A8 8 0 008 0M2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484q-.121.12-.242.234c-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 112.04 4.327z"></path>
    //     </svg>
    // },
    // {
    //     name:"Feedback",
    //     route:"feedback",
    //     svg: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="bi topbar-icon bi-question-square-fill" viewBox="0 0 16 16">
    //         <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927"/>
    //     </svg>
    // },
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
