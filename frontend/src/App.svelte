<script lang="ts">
  import { onMount } from 'svelte';

  let healthStatus: string = 'Checking...';

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/health');
      const data = await response.json();
      healthStatus = data.message;
    } catch (error) {
      healthStatus = 'Backend not connected';
    }
  });
</script>

<main>
  <h1>Welcome to Arete</h1>

  <div class="card">
    <p>Backend Status: <strong>{healthStatus}</strong></p>
  </div>

  <p class="info">
    Mobile-first web service with Svelte frontend and TypeScript backend
  </p>
</main>

<style>
  main {
    text-align: center;
    padding: 1rem;
    max-width: 100%;
  }

  h1 {
    margin-bottom: 1rem;
  }

  .card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem auto;
    max-width: 100%;
  }

  .info {
    color: #888;
    font-size: 0.9rem;
  }

  @media (min-width: 768px) {
    .card {
      padding: 1.5rem;
      max-width: 600px;
    }
  }
</style>
