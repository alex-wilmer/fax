import React, { useState } from 'react'
import { render } from 'react-dom'

let endpoint = '.netlify/functions/sendFax'

let Form = () => {
  let [text, setText] = useState('')

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button
        onClick={async () => {
          let response = await fetch(endpoint).then(r => r.text())
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