import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Amplify } from 'aws-amplify';
import outputs from "../amplify_outputs.json";
Amplify.configure({
	Auth: {
	  Cognito: {
		userPoolId: outputs.auth.user_pool_id,
		userPoolClientId: outputs.auth.user_pool_client_id,
		identityPoolId: outputs.auth.identity_pool_id,
		loginWith: {
		  email: true,
		  username: true,
		  phone: false
		}
	  }
	}
  });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
