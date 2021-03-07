import App from './App.svelte';
import { auth } from './firebase';

import { user } from './stores/user';

auth.onAuthStateChanged(currentUser => {
	
		user.login(currentUser)

		const app = new App({
			target: document.body,
		});

})




export default app;