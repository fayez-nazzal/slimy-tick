import React from "react"

const ShiftBy = ({ x = 0, y = 0, children, ...delegated }) => {
  return (
    <div {...delegated} style={{ transform: `translate(${x}, ${y})` }}>
      {children}
    </div>
  )
}

export default ShiftBy
