import { Link } from "react-router-dom";

const features = [
  { icon: "🤖", title: "AI-Assisted Matching", text: "Gemini AI ranks the most suitable available donors for every blood request." },
  { icon: "⏳", title: "Automatic Cooldown", text: "Recently donated donors are hidden until they are eligible again." },
  { icon: "✅", title: "Smart Completion", text: "Donors tap “I'm Going”. The request closes when enough donors commit." },
  { icon: "🔒", title: "Donor Privacy", text: "A donor's phone number is shared only after they accept your request." },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-red-50 px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-red-700 md:text-5xl">
          Find the right blood donor, fast.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          LifeLink AI connects voluntary blood donors with patients who need
          blood in Bangladesh, using AI to recommend the most suitable donors.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/request" className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
            Request Blood
          </Link>
          <Link to="/donor/register" className="rounded-lg border border-red-600 px-6 py-3 font-semibold text-red-600 hover:bg-red-100">
            Become a Donor
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold">Why LifeLink AI?</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl bg-white p-6 shadow">
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blood groups */}
      <section className="bg-gray-50 px-4 py-12 text-center">
        <h2 className="mb-6 text-2xl font-bold">Blood Groups</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {bloodGroups.map((g) => (
            <span key={g} className="rounded-full bg-red-600 px-5 py-2 font-bold text-white">
              {g}
            </span>
          ))}
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-gray-500">
        AI supports donor recommendation only. Medical eligibility must be verified by healthcare professionals.
      </footer>
    </div>
  );
}