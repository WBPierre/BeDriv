import React from "react";

function IntroBackground(){

    return(
        <div style={{width:'100%', height:'100%', position:'absolute', zIndex:-1}}>
            <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 100 100' preserveAspectRatio="none">
                <rect fill='#283149' width='100%' height='100%'/>
                <g>
                    <polygon fill='#21283c' points='100 33 0 70 0 57 100 19'/>
                    <polygon fill='#1d2435' points='100 45 0 83 0 70 100 31'/>
                    <polygon fill='#1a1f2f' points='100 58 0 95 0 81 100 44'/>
                    <polygon fill='#161b28' points='100 100 0 100 0 94 100 57'/>
                </g>
            </svg>
        </div>
    )
}

export default IntroBackground;
