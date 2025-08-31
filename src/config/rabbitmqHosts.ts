export interface RabbitMQHost {
  id: string;
  name: string;
  host: string;
  port: string;
  minMessagesThreshold: number;
  usernameEnvVar: string;
  passwordEnvVar: string;
}

export const rabbitMQHosts: RabbitMQHost[] = [
  {
    id: 'astra',
    name: 'Astra Queue',
    host: 'astraftblveque.astra.mal.mgsops.com',
    port: '15672',
    minMessagesThreshold: 10,
    usernameEnvVar: 'VITE_RABBITMQ_ASTRAUSER',
    passwordEnvVar: 'VITE_RABBITMQ_ASTRAPASSWORD'
  },
  {
    id: 'deriv',
    name: 'Deriv Queue',
    host: 'rabbitmq.deriv.com',
    port: '15672',
    minMessagesThreshold: 20,
    usernameEnvVar: 'VITE_RABBITMQ_DERIVUSER',
    passwordEnvVar: 'VITE_RABBITMQ_DERIVPASSWORD'
  }
];

export const MANUAL_SELECTION_ID = 'manual';