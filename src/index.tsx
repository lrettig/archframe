import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
// import { neynar } from 'frog/hubs'

export const app = new Frog({
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.use('/*', serveStatic({ root: './public' }))

app.hono.post('/submit/:requestId/:recipient/:amount', (c) => {
  const { requestId, recipient, amount } = c.req.param()
  return c.redirect(`https://daimo.com/l/r/${recipient}/${amount}/${requestId}`)
})

app.frame('/welcome/:requestId/:recipient/:amount', (c) => {
  const { req, status } = c
  console.log(`[WELCOME] Got request: ${JSON.stringify(req)}`)

  const { requestId, recipient, amount } = c.req.param()
  console.log(`[WELCOME] Payment ID: ${requestId}, Recipient: ${recipient}, Amount: ${amount}`)
  return c.res({
    action: `/submit/${requestId}/${recipient}/${amount}`,
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {`You're sending \$${amount} to ${recipient} on Venmo in exchange for ${amount} USDC on Daimo`}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter Venmo username" />,
      <Button>Submit</Button>,
    ],
  })
})

devtools(app, { serveStatic })

const port = parseInt(process.env.PORT || '3000', 10)
serve({
  fetch: app.fetch,
  port: port,
})
console.log(`Server is running on port ${port}`)