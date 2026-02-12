import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <h3 className="text-3xl font-bold text-center text-gray-800">
        What You Can Do
      </h3>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
        <FeatureCard
          title="Book Management"
          description="Add, update, search, and manage books efficiently."
        />
        <FeatureCard
          title="Issue & Return"
          description="Track issued books, due dates, and returns easily."
        />
        <FeatureCard
          title="Secure Access"
          description="Role-based access with JWT authentication."
        />
      </div>
    </section>
  );
}
