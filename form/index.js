import React, { useState } from 'react'
import { render } from 'react-dom'

let fnsFolder = '.netlify/functions'

let Form = () => {
  let [ownerName, setOwnerName] = useState('')
  let [faxNum, setFaxNum] = useState('')

  let sendFax = async () => {
    let response = await fetch(`${fnsFolder}/sendfax`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ownerName, faxNum
      })
    }).then(r => r.text())
      .catch(error => {
        console.log('error', error.message)
      })
    console.log(response)
  }

  return (
    <>
      <h2>Prescription Approval for Pawprint Oxygen</h2>
      <label>Owner Name</label>
      <input value={ownerName} onChange={e => setOwnerName(e.target.value)} />

      <label>Fax Number</label>
      <input value={faxNum} onChange={e => setFaxNum(e.target.value)} />
      <div>
        <button
          onClick={sendFax}
        >send fax</button>
      </div>
    </>
  )
}

render(
  <Form />,
  document.getElementById('root')
)