import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const CreatedApplications = () => {

  const { user } = useUser();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
  }, []);

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // 🔥 SORT BY AI SCORE (highest first)
  const sortedApplications = [...(applications || [])].sort(
    (a, b) => (b.ai_score || 0) - (a.ai_score || 0)
  );

  return (
    <div className="flex flex-col gap-4">

      {/* 🔥 HEADER */}
      <h2 className="text-xl font-bold">
        🚀 Your Applications (Ranked by AI)
      </h2>

      {/* ❌ EMPTY STATE */}
      {sortedApplications.length === 0 && (
        <p className="text-gray-500">No applications yet.</p>
      )}

      {/* 🔥 RANKED LIST */}
      {sortedApplications.map((application, index) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate
            rank={index + 1}
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;