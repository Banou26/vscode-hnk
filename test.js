import { registerElement, css, bind, poz } from '/oz.js'

const style = _ => css`
@import url(https://fonts.googleapis.com/css?family=Roboto:100,400,500);
@import url('/assets/fonts/socicon.css');

app-auth {
  background-color: #0f0f0f;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#logo {
  height: 20rem;
  margin-top: auto;
  transition: transform 1s;
}

.methods, .email {
  color: #fff;
  margin: auto;
  margin-top: 2rem;
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 500;
  font-family: Roboto,Helvetica,Arial,sans-serif;
  overflow: hidden;
}

.methods app-button {
  width: 20rem;
  margin: 4.5rem 1.5rem;
}

.email app-button {
  width: 21rem;
  margin: 2.25rem 1rem;
}

.email app-input-text {
  width: 50%;
  margin: 1rem 25%;
  position: relative;
  cursor: default;
  font-size: 14px;
  letter-spacing: 1px;
  margin-bottom: 5px;
}
`

const _methods = {
  email: '#db4437',
  google: ['#fff', 'rgba(0, 0, 0, .7)'],
  twitter: '#55acee',
  facebook: '#3b5998',
  github: '#333333'
}
const methods = Object.entries(_methods)
const getColor = color => isArray(color) ? color[1] : undefined
const getBgColor = color => isArray(color) ? color[0] : color

const { isArray } = Array

const template = ({state, state: {method, locale, signup}, methods: {email, back, presubmit}}) => poz`
img#logo(src="/assets/images/logo.svg")
${method
? poz`
.email(on-keypress=${presubmit})
  app-input-text(${bind(state, 'email')}) ${locale.email}
  app-input-text(type=${'password'} ${bind(state, 'password')}) ${locale.password}
  app-button(on-click=${back} backgroundColor=${'#db4437'}) ${locale.back}
  app-button(backgroundColor=${'#55acee'}, on-click=${presubmit}) ${signup ? locale.sign_up : locale.sign_in}
`
: poz`
.methods
  ${methods.map(([name, color]) => poz`
  app-button(on-click=${email} color=${getColor(color)} backgroundColor=${getBgColor(color)}) 
    div(style="${getColor(color) ? `color:${getColor(color)};` : ''}")
      span.socicon-${name === 'email' ? 'mail' : name}
      ${locale[name]}`)}
`}
`

export default registerElement({
  name: 'app-auth',
  template,
  style,
  state: ctx => ({
    signup: false,
    email: '',
    password: '',
    method: null,
    get locale () { return ctx.store.locale.auth }
  }),
  methods: {
    back: ({state}) => (state.method = null),
    email: ({state}) => (state.method = 'email'),
    submit: async ({state: {email, password}, store: {auth}}) => {
      console.log('yey', auth, email, password)
      try {
        const loginRes = await auth.signIn(email, password)
        console.log(loginRes)
      } catch (err) {
        console.error(err) // auth/user-not-found
      }
    },
    presubmit: ({state, methods: {submit}}, ev) => (ev instanceof KeyboardEvent && ev.key === 'Enter') || ev instanceof MouseEvent ? submit() : undefined
  }
})
