<script>
	import Router, { push } from 'svelte-spa-router';
	import routes from './router';
	import { MaterialApp, Button, AppBar, Menu, List, ListItem, Icon } from 'svelte-materialify';
	import { mdiAccount } from '@mdi/js';
	import { auth } from './firebase';

	import { user } from './stores/user';

	// Components
	import LoginForm from './components/LoginForm.svelte';

	// Login form modal controller 
	let active = false;
</script>

<MaterialApp>
	<AppBar flat>
		<span slot="title">Scannsend</span>
		<div style="flex-grow:1" />
		<div class="mr-4">
			{#if $user}
				<Menu right offsetY={false}>
					<div slot="activator">
						<Button text class="primary-text">
							<Icon path={mdiAccount} class="mr-2" />
							Hola {$user.email}!
						</Button>
					</div>
					<List>
						<ListItem on:click={() => push('/dashboard')}>Estadísticas</ListItem>
						<ListItem on:click={() => push('/meliqrs')}>Flex Qrs</ListItem>
						<ListItem on:click={() => push('/sent')}>Enviados</ListItem>
						<ListItem on:click={() => push('/report')}>Reporte</ListItem>
						<ListItem on:click={() => push('/settings')}>Ajustes</ListItem>
					</List>
				</Menu>
				<Button class="red-text" text on:click={() => auth.signOut()}>Cerrar sesión</Button>
			{:else}
				<Button text on:click={() => active = true}>Iniciar sesión</Button>
			{/if}
		</div>
	</AppBar>

	<LoginForm {active} on:close={() => active = false} />

	<Router {routes} />
</MaterialApp>

<style>
</style>