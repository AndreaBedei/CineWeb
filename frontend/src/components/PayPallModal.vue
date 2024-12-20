<script lang="ts" setup>
import { ref, onMounted } from "vue";

const props = defineProps<{
  price: string;
}>();

const emit = defineEmits(["close"]);

declare global {
  interface Window {
    paypal: {
      Buttons: (options: { createOrder: (data: unknown, actions: { order: { create: (details: { purchase_units: { amount: { value: string } }[] }) => Promise<string> } }) => Promise<string>; onApprove: (data: unknown, actions: { order: { capture: () => Promise<{ payer: { name: { given_name: string } } }> } }) => Promise<void>; onError: (err: Error) => void }) => { render: (container: HTMLElement) => void };
    };
  }
}

// Riferimento al container del pulsante PayPal
const paypalContainer = ref<HTMLDivElement | null>(null);

const loadPayPalScript = async () => {
  // Verifica se lo script è già caricato
  if (document.getElementById("paypal-sdk")) return;

  const script = document.createElement("script");
  script.id = "paypal-sdk";
  script.src = "https://www.paypal.com/sdk/js?client-id=AYlz7kDABA8wmlDg6wGHsjUUg74RC0xS8TmHMBPe2U6APhS0d4Fm2-SYOwV5CVHZM3wWsfI5h7iX37Wp&currency=EUR";
  script.async = true;
  document.head.appendChild(script);

  // Aspetta che il PayPal SDK sia caricato
  return new Promise((resolve) => {
    script.onload = resolve;
  });
};

onMounted(async () => {
  await loadPayPalScript();

  // Configura i pulsanti PayPal
  if (window.paypal && paypalContainer.value) {
    window.paypal.Buttons({
      createOrder(_, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: props.price, // Prezzo
              },
            },
          ],
        });
      },
      async onApprove(_, actions) {
        return actions.order.capture().then((details) => {
          alert("Pagamento completato da " + details.payer.name.given_name);
        });
      },
      onError(err) {
        console.error("Errore durante il pagamento:", err);
      },
    }).render(paypalContainer.value);
  }
});

function closeModal() {
  emit("close");
}
</script>

<template>
  <div 
    role="dialog" 
    aria-labelledby="paypal-modal-title" 
    aria-hidden="false" 
    class="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
    
    <div class="bg-white rounded-lg w-full max-w-lg p-6 space-y-4 overflow-y-auto max-h-[90vh]">
      <p id="paypal-modal-title" class="text-xl font-bold text-center mb-4">Pagamento con PayPal</p>
      
      <!-- Contenitore del pulsante PayPal -->
      <div ref="paypalContainer" class="paypal-button-container w-full"></div>
      
      <!-- Bottoni per chiudere il modale (aggiungi personalizzazione se necessario) -->
      <div class="flex justify-end">
        <button @click="closeModal" class="px-4 py-2 bg-red-500 text-white rounded-md">Chiudi</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.paypal-button-container {
  max-width: 100%;
  margin: 0 auto;
}

/* Mobile-first: Aggiungi uno scroll nel caso in cui il contenuto del modale ecceda la dimensione dello schermo */
@media (min-width: 640px) {
  .paypal-button-container {
    width: 100%;
  }
}
</style>
