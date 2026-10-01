import { Activity, Boxes, Gauge, Globe2, Lock, Zap, type LucideIcon } from 'lucide-react'

export const benefits: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Zap, title: 'Cold starts in 180 ms', body: 'Weights are streamed from a regional cache while the container boots. Scale to zero without paying for it in latency.' },
  { icon: Gauge, title: 'Continuous batching', body: 'Requests are batched at the token level, so throughput rises with traffic instead of queueing behind it.' },
  { icon: Globe2, title: '31 regions, one endpoint', body: 'Anycast routing sends every request to the nearest healthy GPU pool. Failover happens before your pager does.' },
  { icon: Boxes, title: 'Any model, any framework', body: 'PyTorch, JAX, vLLM, TensorRT-LLM or a custom container. If it runs on a GPU, it runs on Nexora.' },
  { icon: Activity, title: 'Observability built in', body: 'Per-request traces, token-level latency and cost per customer — exported to the tools you already use.' },
  { icon: Lock, title: 'Private by default', body: 'SOC 2 Type II, single-tenant clusters and VPC peering. Your weights and prompts never leave your boundary.' },
]

export const metrics = [
  { value: 38, suffix: 'ms', label: 'p50 time to first token' },
  { value: 99.99, suffix: '%', label: 'Uptime, trailing 12 months', decimals: 2 },
  { value: 4.2, suffix: 'B', label: 'Tokens served per day', decimals: 1 },
  { value: 31, suffix: '', label: 'Regions worldwide' },
]

export const integrations = [
  'PyTorch', 'Hugging Face', 'vLLM', 'TensorRT', 'JAX', 'ONNX',
  'Kubernetes', 'Terraform', 'AWS', 'Google Cloud', 'Azure', 'OpenTelemetry',
  'Datadog', 'Grafana', 'Prometheus', 'LangChain', 'LlamaIndex', 'Weights & Biases',
]

export const testimonials = [
  {
    quote: 'We moved our entire inference stack in a weekend. Latency dropped by half and we stopped hiring for on-call.',
    name: 'Priya Raman',
    role: 'CTO, Halcyon Robotics',
  },
  {
    quote: 'Scale-to-zero that actually works. Our GPU bill now follows our traffic curve instead of our fears.',
    name: 'Jonas Weber',
    role: 'Head of Platform, Fieldnote',
  },
  {
    quote: 'The traces alone are worth it. For the first time we can tell a customer exactly why a request was slow.',
    name: 'Amara Okafor',
    role: 'Staff Engineer, Lattice Health',
  },
]

export const plans = [
  {
    name: 'Developer',
    monthly: 0,
    annual: 0,
    blurb: 'For side projects and prototypes.',
    features: ['$25 of free compute monthly', 'Shared GPU pools', '3 deployed models', 'Community support'],
    cta: 'Start free',
  },
  {
    name: 'Team',
    monthly: 499,
    annual: 399,
    blurb: 'For products in production.',
    features: ['Dedicated GPU pools', 'Unlimited models', 'Autoscaling & scale-to-zero', 'Traces & cost analytics', 'Email & Slack support'],
    cta: 'Start 14-day trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    monthly: null,
    annual: null,
    blurb: 'For regulated and high-volume workloads.',
    features: ['Single-tenant clusters', 'VPC peering & private link', 'Custom SLAs, 99.99%', 'SOC 2, HIPAA, GDPR', 'Named engineer'],
    cta: 'Talk to sales',
  },
]

export const productTabs = [
  {
    id: 'deploy',
    label: 'Deploy',
    title: 'From checkpoint to endpoint in one command.',
    body: 'Point Nexora at a model on Hugging Face, S3 or your registry. We pick the GPU, build the container and give you an OpenAI-compatible endpoint.',
    code: ['$ nexora deploy meta-llama/Llama-3.1-70B \\', '    --gpu h100 --min 0 --max 24', '', '✓ Weights cached in 31 regions', '✓ Endpoint live  api.nexora.ai/v1/llama-70b', '  p50 41ms · $0.00031 / 1k tokens'],
  },
  {
    id: 'scale',
    label: 'Scale',
    title: 'Traffic spikes are somebody else’s problem.',
    body: 'Replicas follow queue depth, not CPU guesses. Scale from zero to hundreds of GPUs and back again, and pay by the second.',
    code: ['$ nexora scale llama-70b --policy latency', '', '  replicas   2 → 18   (queue 412)', '  p95        88ms → 64ms', '  cost/hr    $7.20 → $58.10', '✓ Scaled in 9.4s'],
  },
  {
    id: 'observe',
    label: 'Observe',
    title: 'Every token, accounted for.',
    body: 'Token-level traces, per-customer cost and drift alerts out of the box. Export everything with OpenTelemetry.',
    code: ['$ nexora trace req_8f21c --tokens', '', '  queue        3ms', '  prefill     21ms  ████', '  decode     212ms  ██████████████', '  total      236ms  · 482 tokens · $0.00015'],
  },
]
