
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

export default function FullPageLoader() {
    return(
  <div style={styles.container}>
    <h3>Loading...</h3>
  </div>)
}