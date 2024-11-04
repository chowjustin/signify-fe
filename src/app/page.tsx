import Hero from "./landing-page/Hero";
import About from "./landing-page/About";
import Footer from "./landing-page/Footer";
import Layout from "@/layouts/Layout";

export default function Home() {
  return (
    <Layout withNavbar withFooter>
      <main>
        <Hero />
        <About />
        <Footer />
      </main>
    </Layout>
  );
}
