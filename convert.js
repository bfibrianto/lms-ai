const fs = require('fs');
let html = fs.readFileSync('../../references/landing-page.html', 'utf8');

// Replace class -> className
html = html.replace(/class="/g, 'className="');
// Self close img and input - already self-closed mostly, wait, let's check
html = html.replace(/<img([^>]+[^\/])>/g, '<img$1 />');
html = html.replace(/<input([^>]+[^\/])>/g, '<input$1 />');
html = html.replace(/<!--(.*?)-->/g, '{/*$1*/}');

let tsxCode = `
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { getDashboardPath } from '@/lib/roles'
import {
  Search,
  Zap,
  ArrowRight,
  Brain,
  Clock,
  BarChart,
  Star,
  Mail,
  Share2,
  Podcast,
  GraduationCap
} from 'lucide-react'

export default async function LandingPage() {
  const session = await auth()
  
  const dashboardHref = session?.user ? getDashboardPath(session.user.role) : '/auth/login'

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background font-sans text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold tracking-tight">LMS AI</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" href="#">Courses</a>
                <a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" href="#">Learning Paths</a>
                <a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" href="#">For Business</a>
                <a className="text-sm font-medium text-slate-600 transition-colors hover:text-primary dark:text-slate-300" href="#">Community</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  className="w-48 rounded-lg border-none bg-slate-100 py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary dark:bg-slate-800 lg:w-64 transition-all"
                  placeholder="Search courses..." type="text" />
              </div>
              <div className="flex items-center gap-2">
                {!session?.user ? (
                  <>
                    <Link
                      href="/auth/login"
                      className="hidden sm:flex text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300"
                    >
                      Login Internal
                    </Link>
                    <Link
                      href="/auth/login"
                      className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                    >
                      Mulai Belajar
                    </Link>
                  </>
                ) : (
                  <Link
                    href={dashboardHref}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-12 lg:flex-row">
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  <Zap className="h-4 w-4" />
                  New: Generative AI 2.0 Specialization
                </div>
                <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                  Master the Future with <span className="text-primary">AI-Powered</span> Learning
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 lg:mx-0">
                  Join 50,000+ students mastering Generative AI, Machine Learning, and Neural Networks
                  through hands-on projects designed by industry experts.
                </p>
                <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                  <Link href="/auth/login" className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white transition-all hover:bg-primary/90">
                    Explore Courses
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <button className="rounded-xl bg-slate-200 px-8 py-4 font-bold text-slate-900 transition-all hover:bg-slate-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
                    Watch Demo
                  </button>
                </div>
                <div className="mt-10 flex items-center justify-center gap-4 text-sm text-slate-500 lg:justify-start">
                  <div className="flex -space-x-2">
                    <img alt="Student" className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-slate-950" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6Vr1hnkdckayItzrUwN2kPNIC54DZ8-cdXPYppRhSergahQyRsbpkNUxRpqjR7I8MpIjDzkFzI4tMW6XxWe9NyrE6UEGsWvnjQMLASu3OxVL1f9wjxSoUMAguvakmFAH18pdVSjP4384ShHI-GiuyIKn0_dAohycAXTXCCU8NdC-CvbSeFT1GqTyPedWC2E4bhVXeJPInvbHiwuqDpHe4p2Ig87WNgEfxlisrRFxf16u1jphA8b9zm2nPZIJNSIE8x0bsfOkQJwg" />
                    <img alt="Student" className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-slate-950" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGa3M7S56uOAFo9DvG0fCAjcYJjmKx7jMM36rseycZeYZvOJiG7D8kNQ15xtJXbIy53BjqlRRHEklETmI19xVJjTdAAhEuc2TWGCPRmKjQHQ4Vo8UMK6SQJABlRpvh0nKaNHD8BUNrk-gtsL4FYgnZx0lQnTzWPBW3KRxx2ZFhBfeQ_khltMoI3mfZ7ilzJyuyjqoJYCud3sPEKX_nOTFOXTQjykk8IGE3sTezY9ro_R4Uru-IwhnFbWMztAkCBrKNxtSAhAdMARM" />
                    <img alt="Student" className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-slate-950" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVaDCb0T9QH26BZfvmLz3TEpR-4CVn5isc0YNON9WUiFeHCE9pIvjmR8h12jo4TS2Po3DeRv9Ed47WaXMCeUymIdDaC6oyk0Kj0Q7bxQeSkBai06OnPoAIxLjMR8FV9tK3BvS7cDXdjsrGLN4QuJtgzTDUkvKBRWKL3Ak7Gt4gK8fG_4XpefQ-096lEZF70fb8AeSC6K3khMg-yR-FxjNypIJKRMDuKzIsOET0pBTl1X_vp_eSeboMDFBQNGCtMT5lO_cqvs0Z2m8" />
                  </div>
                  <span><strong className="text-slate-900 dark:text-white">4.9/5</strong> from over 2,000 reviews</span>
                </div>
              </div>
              <div className="w-full flex-1 max-w-xl lg:max-w-none">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 lg:aspect-square bg-slate-800">
                  <img alt="AI Interface" className="h-full w-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyxow0L4Q4M--CZ689Pp9lGKuozYe67pSufKdiLJhAAJAUy6ys6icjAHOiNvcleCFaLVaxz2Z-PleH7M9DVEj3-DAB1VYLrTIjlZW8kvWFF1tyOZumcSLlaEGhLpm-rwbKr1mCdPfdMUTyvHEAoudDdE2-hkgVkDdHUkkEZVfZoIURXls-kuHej1qsK96lxYL9PXY31yM1-a2x7Bb-ZOKf3CB4UAI1lvrIogJYHSB5MxIbZhPER8IpTlvo7e0BxloIJvhg93DrLs8" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-slate-700/50 bg-slate-900/60 p-6 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary p-3">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white">Neural Network Training</p>
                        <p className="text-xs text-slate-300">Live processing: Epoch 42/100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-slate-200 py-12 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="text-center">
                <p className="mb-1 text-3xl font-black text-primary">50K+</p>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Active Students</p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-3xl font-black text-primary">94%</p>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-3xl font-black text-primary">200+</p>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Expert Mentors</p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-3xl font-black text-primary">45</p>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Global Partners</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Master the Most In-Demand AI Skills</h2>
                <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                  From prompt engineering to building your own large language models, our curriculum is designed to take you from beginner to expert.
                </p>
              </div>
              <button className="flex items-center gap-2 font-bold text-primary hover:underline">
                View All Courses
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Course Card 1 */}
              <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50">
                <div className="relative aspect-video overflow-hidden">
                  <img alt="Generative AI" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOvOwD77tAU0PmBC7slLzDz8_Nvq34V4eKoo275IfNLLPZXa75Vzbm3rkvj7riujCZoP2ETz7ltz2D9bUPPdgytkzDVqTnIHros0qWdDfXriX4Hoj0A8oXPh9X-C_0dy5L4U-iXdN9Lsgah43YCYawzaqBfwTtQKhehveXXe87sKlq-WiUjWfNUt69B82r2lLUq_mXIMaAJMXv00SHwriqUUaWNckUCVzYM-kV9cjPqFO_8EPWQr2ALDMq3eOrSQicmd-MxzizYMw" />
                  <div className="absolute left-4 top-4 rounded-md bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Bestseller</div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> 12 Weeks
                    <BarChart className="ml-2 h-3.5 w-3.5" /> Intermediate
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">Generative AI Mastery</h3>
                  <p className="mb-6 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">Learn to build, fine-tune and deploy LLMs using industry standard frameworks like PyTorch and HuggingFace.</p>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">4.8</span>
                      <span className="text-xs text-slate-500">(2.4k)</span>
                    </div>
                    <p className="text-xl font-black text-primary">$199.99</p>
                  </div>
                </div>
              </div>

              {/* Course Card 2 */}
              <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50">
                <div className="relative aspect-video overflow-hidden">
                  <img alt="Deep Learning" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJnEpXSuQsYrvSlBPre4rM9sdGQHXTjtxacmOqZvaEYRVYKeDJDZ-4NWJEz17p3FmU3luyE3TzVRXObZcrXtvIpuQoGcA7RpArx7K_R1PY7vWTJfuEeu1ttnkd04S7Poh-jRUTYXTQoxTIG-VqtU7C5Ux3yroS5rJsCIi7wBaYL93XI-VxNRpzWf5BXnUtDa93gPdgaoMMkihiSYibsIDyRtiJBxKJQEqpuGZyrpnESw__Q3JObLVDNpgwxJxniI4WCAH4Jfmo_7I" />
                  <div className="absolute left-4 top-4 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">New</div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> 8 Weeks
                    <BarChart className="ml-2 h-3.5 w-3.5" /> Advanced
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">Deep Learning Architectures</h3>
                  <p className="mb-6 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">Master CNNs, Transformers, and GANs. Build production-grade computer vision and NLP models.</p>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">4.9</span>
                      <span className="text-xs text-slate-500">(1.1k)</span>
                    </div>
                    <p className="text-xl font-black text-primary">$249.99</p>
                  </div>
                </div>
              </div>

              {/* Course Card 3 */}
              <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50">
                <div className="relative aspect-video overflow-hidden">
                  <img alt="Prompt Engineering" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHFVhTzqKrpVenegFqkn7fq5qfO7reWBthSJ9HwP2OFWX4PkHHfqmC-b4eNVWWxpopFb8dFnL162qhn_RGZmzmCHWqEQxnLqkt9jsmxYDMUXJQie52TK5rSv-_L4UzJKxu3J8SPbswHL2_oOqqO4LjK5NtPharvr3OWiImgoQERZSZb-HH_hl4aB02hh7o_NBRu49suZ60JsagEXRBk4SDdKFBnNKbfGVI44TqPElllwfKuGHFTkLPXd7iuUrd18WTjaKvs-IHsMw" />
                  <div className="absolute left-4 top-4 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Popular</div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" /> 4 Weeks
                    <BarChart className="ml-2 h-3.5 w-3.5" /> Beginner
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white">Prompt Engineering Pro</h3>
                  <p className="mb-6 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">Learn the art of communicating with AI to get perfect results every time. Optimized for ChatGPT and Midjourney.</p>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6 dark:border-slate-800">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">4.7</span>
                      <span className="text-xs text-slate-500">(850)</span>
                    </div>
                    <p className="text-xl font-black text-primary">$89.99</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="relative overflow-hidden py-20 bg-slate-50 dark:bg-slate-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">Success Stories</h2>
              <p className="text-slate-600 dark:text-slate-400">Join thousands of students who have transformed their careers with us.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {/* Story 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-6 flex items-center gap-4">
                  <img alt="Student" className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgVDSuFshndVN6ykf2PkDj8KDmZg9dYAlWXYLY3Q6ErgFjiD-ZfRMbL4gPvO9Jw6V3NOC67x04Y_UXuKV71Ek5OIN-HN2L1TboqM0UpSBQ8pllD6oFx5dcrDm5gavBjoAuZh_l3EPyxyFWBUIh3k5LBg-AOPrzpVGCO6Nuh1fkvzXZ3pu8m8pAz3WQ9rRPoj4IMxsv4Hb-CPp_-J_MnPp_HymSIwM7gE5QoNu-frgTiXmbKMnweXDP1R966nZIo3vqjfWz6Be3PoE" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Marcus Chen</p>
                    <p className="text-xs text-slate-500">Data Scientist at TechFlow</p>
                  </div>
                </div>
                <p className="line-clamp-4 leading-relaxed italic text-slate-600 dark:text-slate-400">
                  "LMS AI's Generative AI course was a game-changer. The hands-on projects helped me transition from traditional analytics to LLM engineering within months."
                </p>
                <div className="mt-6 flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
              </div>

              {/* Story 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-6 flex items-center gap-4">
                  <img alt="Student" className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDY0NCjFrTVVddPzzLHiYCsiWS3P8wsf8DuC2ozw_KK6WX37ePf5RvpXDJ8m_TDj0p4WfKp2xJ8XYbIEUrq5FHgL6TAF_8IlNHzSB0zD6Qq1YVYUDrOOi8JWuyAjYmh_JBPme9cPbyFRgV7sq9BTYbi1MBDGBeQR-V8k0IO1qgII5HaEjra0Hj6kixkID3Uwh082rBiinbgbtePvbrMQ3fA8BUEQ987b8VWs7Jcdf7Pd5JOhTbWquH4OaAFODP-9pF1c6MhLMZnK10" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Elena Rodriguez</p>
                    <p className="text-xs text-slate-500">ML Research Lead</p>
                  </div>
                </div>
                <p className="line-clamp-4 leading-relaxed italic text-slate-600 dark:text-slate-400">
                  "The depth of the Deep Learning module is incredible. The mentors are actually working in the industry, which makes a massive difference in real-world application."
                </p>
                <div className="mt-6 flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
              </div>

              {/* Story 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-6 flex items-center gap-4">
                  <img alt="Student" className="h-12 w-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtWs91-y2AyZz2ujeRe5vJCidqdoK9Bb9h49d2YMhkAVN-SbuF1VlgUH6_URT-aKntW5hOYYbqJasVCGiI_tZ9ulXZcOX5CmbV9FteYTP6ZviH1070VoBQ-HfouTJSCmU45zlIHdypb_-Ut8afkAiomQz7nlVI39votfta4KbhZTA7kEWMsx0ntaka6TAn6Rp0m42KTYsjdiIJ0OrYsdH4D5yRFyTRrVnG23ttYXtrgl_TrPmCBNMjc6NV3cpwazA63kzaiXBvTwE" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">James Wilson</p>
                    <p className="text-xs text-slate-500">Fullstack AI Developer</p>
                  </div>
                </div>
                <p className="line-clamp-4 leading-relaxed italic text-slate-600 dark:text-slate-400">
                  "I went from knowing zero about prompts to building my own AI agent in three weeks. The curriculum is perfectly paced and extremely practical."
                </p>
                <div className="mt-6 flex gap-1 text-primary">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-center md:p-16">
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <img alt="Patterns" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCUJOo0GiuFzcUMCw2PQWy0MNUncx8VX63L5cSjG8j9tRt7mP8TrMHno96cSxtvM4W7z_vdedU5F3xhvTGYq0yPY6XTGMDIO2SBWLIlINIv62kiiaVJIT-eSJKfOFecW_Vi83fFfm4EzxmoqbjKnGmyD6DZsA5XD91eGkjWab0c_jVyHQrvp1fbz5sMNSfAxOU0zTJenzuwMZXxoCAA8ELaxkWVY4zXug6L0ozUcObv30u4Gl-OV5LTRYgLhxagZfu-WLjhxIt3Go" />
              </div>
              <div className="relative z-10 mx-auto max-w-3xl">
                <h2 className="mb-6 text-3xl font-black text-white md:text-5xl">Ready to Lead the AI Revolution?</h2>
                <p className="mb-10 text-lg text-white/90 md:text-xl">
                  Join 50,000+ students and start your journey today. Get unlimited access to all courses and our global community.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/auth/login" className="rounded-xl bg-white px-8 py-4 font-bold text-primary shadow-xl transition-all hover:bg-slate-100">
                    Start Learning Now
                  </Link>
                  <button className="rounded-xl border border-white/30 bg-primary/20 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10">
                    Browse Curriculum
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
            <div className="col-span-2">
              <div className="mb-6 flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold tracking-tight">LMS AI</span>
              </div>
              <p className="mb-8 max-w-xs text-slate-500 dark:text-slate-400">
                The world's leading platform for hands-on artificial intelligence education. Built by experts, for the next generation of engineers.
              </p>
              <div className="flex gap-4">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-400">
                  <Mail className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-400">
                  <Share2 className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-400">
                  <Podcast className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="mb-6 font-bold text-slate-900 dark:text-white">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="transition-colors hover:text-primary">Courses</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Learning Paths</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Mentors</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-bold text-slate-900 dark:text-white">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="transition-colors hover:text-primary">Blog</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Documentation</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Community</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Free Tools</a></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-bold text-slate-900 dark:text-white">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="transition-colors hover:text-primary">About Us</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Careers</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Privacy</a></li>
                <li><a href="#" className="transition-colors hover:text-primary">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 dark:border-slate-800 md:flex-row">
            <p className="text-xs text-slate-500 dark:text-slate-400">© 2024 LMS AI Academy. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>English (US)</span>
              <span>System Theme</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
`

fs.writeFileSync('src/app/page.tsx', tsxCode);
