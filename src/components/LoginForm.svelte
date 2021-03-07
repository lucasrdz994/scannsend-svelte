<script>
  import { Dialog, Card, CardTitle, CardText, CardActions, Button, TextField, Container } from 'svelte-materialify'
  import { createEventDispatcher } from 'svelte';
  import { auth } from '../firebase';

  export let active;

  let email = '', password = '';

  const dispatch = createEventDispatcher();

  const close = () => dispatch('close');

  const handleLogin = async () => {
    await auth.signInWithEmailAndPassword(email, password);
    close();
  }

</script>

<Dialog bind:active persistent>
  <Card>
    <form on:submit|preventDefault={handleLogin}>
      <CardTitle>Ingresa con tu Email</CardTitle>
      <CardText>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia deleniti natus
        dolore, rerum hic beatae officiis at ea sequi labore.
      </CardText>
        <TextField class="pr-6 pl-6 pb-2 pt-2" bind:value={email}>Email</TextField>
        <TextField class="pr-6 pl-6 pb-2 pt-2" bind:value={password}>Contraseña</TextField>
      <CardActions>
        <div style="flex-grow:1" />
        <Button on:click={close} text>Cerrar</Button>
        <Button type="submit" text>Login</Button>
      </CardActions>
    </form>
  </Card>
</Dialog>