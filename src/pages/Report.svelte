<script>
  import { MaterialApp, Container, Card, CardTitle, CardSubtitle, TextField, Button, CardActions } from 'svelte-materialify';
  import { report } from '../stores/report';
  import { json2excel } from 'js2excel';

  const today = () => {
    const date = new Date().toLocaleDateString().split('/').reverse()
    if (date[1].length === 1) { date[1] = '0' + date[1] }
    if (date[2].length === 1) { date[2] = '0' + date[2] }
    return date.join('-')
  }

  let value = today();
  $: disabled = $report.length > 0 ? false : true;

  $: console.log($report)

  function downloadReport() {
    const data = [];

    $report.forEach(item => {
      data.push({
        '# de orden': item.orderId,
        '# de envío': item.id,
        'Vendedor': item.seller.nickname,
        'Comprador': item.buyer.name,
        'Dirección': item.buyer.fullAddress,
        'Ciudad': item.buyer.city + ', ' + item.buyer.state,
        'Fecha de escaneo': new Date(item.scannedAt).toLocaleString(),
        'Fecha de compra': new Date(item.createdAt).toLocaleString()
      })
    })

    try {
      json2excel({
        data,
        name: value
      });
    } catch (error) {
      console.error('export error');
    }
  }
</script>

<MaterialApp>
  <Container>
    <Card>
      <CardTitle>Descarga un reporte de tus envíos</CardTitle>
      <CardSubtitle>Podes agregar todos los envíos que necesites y descargar un excel con los datos.</CardSubtitle>
      <CardSubtitle>Hay {$report.length} envíos en el reporte.</CardSubtitle>
      <div class="pr-8 pl-8 pb-8">
        <Card outlined>
          <div class="pa-4">
            <TextField bind:value outlined placeholder="Ej. Fecha de hoy">Nombre del reporte</TextField>
          </div>
          <CardActions>
            <div style="flex-grow:1" />
            <Button text class="primary-text" on:click={downloadReport} bind:disabled>Descargar</Button>
          </CardActions>
        </Card>
      </div>
    </Card>
  </Container>
</MaterialApp>