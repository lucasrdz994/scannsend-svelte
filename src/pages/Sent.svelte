<script>
  import { MaterialApp, Container, Card, List, ListItem, TextField, Button, CardActions, Col, Row, Checkbox, Snackbar } from 'svelte-materialify';
  import { db, auth } from '../firebase';
  import { report } from '../stores/report';
  import { sentPaginationNext, sentPaginationPrev } from '../utils/shipments';

  const today = () => {
    const date = new Date().toLocaleDateString().split('/').reverse()
    if (date[1].length === 1) { date[1] = '0' + date[1] }
    if (date[2].length === 1) { date[2] = '0' + date[2] }
    return date.join('-')
  }

  let dateFrom = today();
  let dateTo = today();
  let group = [];
  let sent = [];
  let filteredSent = [];
  let filterInput = '';
  let checked = false;
  let snackbarText = '';

  // Pagination
  let lastItem = '';
  let firstItem = '';
  let snackbar = false;

  function checkAll() {
    if(checked === false) {
      group = [];
      group = sent.map(item => item.uid);
      checked = true;
    } else {
      group = [];
      checked = false;
    }
  }

  function handleFilter() {
    filteredSent = sent.filter(item => {
      if (
        item.buyer.name.toLowerCase().includes(filterInput.toLowerCase()) ||
        item.buyer.fullAddress.toLowerCase().includes(filterInput.toLowerCase()) ||
        item.orderId.toString().includes(filterInput) ||
        item.id.toString().includes(filterInput)
      ) {
        return true
      }
    });
  }

  $: filteredSent = sent;

  async function handleSearch() {
    const from = Date.parse(dateFrom) + 60 * 60 * 3 * 1000;
    const to = Date.parse(dateTo) + 60 * 60 * 27 * 1000;

    const ref = db.collection('users')
    .doc(auth.currentUser.uid)
    .collection('shipments')
    .where('scannedAt', '>=', from)
    .where('scannedAt', '<=', to)
    .orderBy('scannedAt', 'desc')
    .limit(50)

    // If input search
    const docs = await ref.get()

    if (!docs.empty) {
      lastItem = docs.docs[docs.docs.length - 1];
      let arr = [];
      docs.forEach(doc => {
        const item = { uid: doc.id, ...doc.data() }
        arr.push(item);
      })
      sent = arr;
    }
  }

  async function nextPage() {
    const res = await sentPaginationNext(lastItem, { dateFrom, dateTo })
    if (res.empty) {
      snackbarText = 'No hay más registos para mostrar.';
      snackbar = true;
      return console.log('empty');
    }
    lastItem = res.lastDoc;
    firstItem = res.firstDoc;
    sent = res.arr;
  }

  async function prevPage() {
    const res = await sentPaginationPrev(firstItem, { dateFrom, dateTo })
    if (res.empty) {
      snackbarText = 'No hay más registos para mostrar.';
      snackbar = true;
      return console.log('empty');
    }
    lastItem = res.lastDoc;
    firstItem = res.firstDoc;
    sent = res.arr;
  }

  async function deleteChecked() {
    const ref = db.collection('users').doc(auth.currentUser.uid).collection('shipments');
    group.forEach(async uid => await ref.doc(uid).delete());

    sent = sent.filter(item => !group.includes(item.uid))
    snackbarText = 'Registros eliminados.';
    snackbar = true;
  }

  function addChecked() {
    const itemsChecked = sent.filter(item => group.includes(item.uid));
    report.pushData(itemsChecked);
    snackbarText = 'Registros agregados al reporte.';
    snackbar = true;
  }

</script>

<MaterialApp>
  <Container>
    <div class="elevation-2">
      <h2 class="text-h4 pa-4">Registro de envíos</h2>
      <Card outlined class="ma-4 pa-2 d-flex justify-space-between align-center">
        <div class="pr-4 pl-4">
          <Row>
            <Col>
              <TextField class="pb-2 pt-2" placeholder="# de orden">Buscar un envío</TextField>
            </Col>
            <Col>
              <TextField bind:value={dateFrom} class="pb-2 pt-2" type="date" placeholder="Fecha desde...">Desde</TextField>
            </Col>
            <Col>
              <TextField bind:value={dateTo} class="pb-2 pt-2" type="date" placeholder="Fecha hasta...">Hasta</TextField>
            </Col>
          </Row>
        </div>
        <CardActions>
          <div style="flex-grow:1" />
          <Button on:click={handleSearch}>Buscar</Button>
        </CardActions>
      </Card>
      <Container>
        <Row>
          <Col cols={9}>
            <div class="d-flex align-center">
              <p class="font-weight-light ma-0 mr-4">Mostrando máximo 50 registros.</p>
              <Button on:click={prevPage}>Anterior</Button>
              <Button on:click={nextPage}>Siguiente</Button>
            </div>
            <div class="pt-4 pb-4">
              <TextField bind:value={filterInput} on:keyup={handleFilter} placeholder="Por comprador, dirección, # de orden o # de envío.">
                Filtrar resultados
              </TextField>
            </div>
            <List>
              <ListItem>
                <span slot="prepend">
                  <Checkbox {checked} on:change={checkAll} />
                </span>
                <span>
                  Seleccionar todos
                </span>
              </ListItem>
              {#each filteredSent as item (item.uid)}
                <ListItem>
                  <span slot="prepend">
                    <Checkbox bind:group value={item.uid} />
                  </span>
                  <span>
                    Envío de <span class="font-weight-bold">{item.buyer.name}</span> a <span class="font-weight-bold">{item.buyer.fullAddress}</span>
                  </span>
                </ListItem>
              {/each}
            </List>
          </Col>
          <Col cols={3}>
            <div class="elevation-2 pa-4">
              <h3 class="text-h5 mb-4">Acciones</h3>
              <Button text class="primary-text" on:click={addChecked} disabled={!group.length}>Agregar al reporte</Button>
              <Button text class="red-text" on:click={deleteChecked} disabled={!group.length}>Eliminar seleccionados</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>

    <Snackbar bind:active={snackbar} right top timeout={3000}>
      {snackbarText}
    </Snackbar>
    
  </Container>
</MaterialApp>