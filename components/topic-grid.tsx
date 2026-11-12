import {
  ShieldAlert,
  Bug,
  Skull,
  Network,
  Globe,
  Cloud,
  Cpu,
  Lock,
  ArrowRight,
  FolderGit2,
} from "lucide-react";
import { exploreTopics } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-xrock-red" />,
  Bug: <Bug className="w-5 h-5 text-xrock-red" />,
  Skull: <Skull className="w-5 h-5 text-xrock-red" />,
  Network: <Network className="w-5 h-5 text-xrock-red" />,
  Globe: <Globe className="w-5 h-5 text-xrock-red" />,
  Cloud: <Cloud className="w-5 h-5 text-xrock-red" />,
  Cpu: <Cpu className="w-5 h-5 text-xrock-red" />,
  Lock: <Lock className="w-5 h-5 text-xrock-red" />,
};

export function TopicGrid() {
  return (
    <section id="topics" className="py-12 sm:py-16 bg-white border-b border-xrock-gray-100">
      <div className="xrock-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-xrock-crimson">
            Knowledge Taxonomy
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-xrock-black tracking-tight mt-1">
            Explore Publication Topics
          </h2>
          <p className="text-sm sm:text-base text-xrock-gray-600 mt-2">
            Curated indexes of verified exploit primitives, defensive architectures, and incident debriefs.
          </p>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {exploreTopics.map((topic) => (
            <a
              key={topic.slug}
              href={`#topic-${topic.slug}`}
              className="p-5 rounded-xl border border-xrock-gray-100 bg-white hover:border-xrock-red/60 hover:shadow-card transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-xrock-gray-50 flex items-center justify-center border border-xrock-gray-100 group-hover:bg-xrock-red/10 group-hover:border-xrock-red/30 transition-colors">
                    {iconMap[topic.icon] || <FolderGit2 className="w-5 h-5 text-xrock-red" />}
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-xrock-gray-50 text-xrock-gray-600 group-hover:text-xrock-black border border-xrock-gray-100">
                    {topic.count} reports
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-xrock-black group-hover:text-xrock-red-dark transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs text-xrock-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-xrock-gray-100 flex items-center justify-between text-xs font-semibold text-xrock-black group-hover:text-xrock-red transition-colors">
                <span>View taxonomy archive</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

