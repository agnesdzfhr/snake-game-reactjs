import React from "react";

export default (props) => {
    return(
        <div>
            {props.snakeDots.map((dot,i)=>{
                const style ={
                    left:`${dot.x}%`,
                    top: `${dot.y}%`,
                }
    
                return(
                    <div className="snake-dot" key={i} style={style}></div>
                )
            })}
        </div>
    )
}