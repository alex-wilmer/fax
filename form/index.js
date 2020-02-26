import React, { useState } from 'react'
import { render } from 'react-dom'

let fnsFolder = '.netlify/functions'

let Form = () => {
  let [text, setText] = useState('')

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button
        onClick={async () => {
          let response = await fetch(`${fnsFolder}/sendfax`).then(r => r.text())
          console.log(response)
        }}
      >send fax</button>
    </>
  )
}

render(
  <Form />,
  document.getElementById('root')
)