import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Boxes, BriefcaseBusiness, Download, School } from 'lucide-react'
import useFetch from '@/hooks/use-fetch'
import { updateApplicationStatus } from '@/api/apiApplications'
import { BarLoader } from 'react-spinners'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const ApplicationCard = ({ application, isCandidate = false, rank }) => {

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  }

  const { loading: loadindHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
    }
  )

  const handleStatusChange = (status) => {
    fnHiringStatus(status);
  }

  // 🎯 AI Score Logic
  const score = application?.ai_score || 0;

  const getScoreStyle = () => {
    if (score >= 80) return "bg-green-100 border-green-500 text-green-700";
    if (score >= 60) return "bg-yellow-100 border-yellow-500 text-yellow-700";
    return "bg-red-100 border-red-500 text-red-700";
  };

  return (
    <Card className={`border-2 ${getScoreStyle()} relative`}>
      
      {/* 🔥 Top Candidate Badge */}
      {score >= 80 && !isCandidate && (
        <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
          Top Candidate 🚀
        </span>
      )}

      {/* 🥇 Rank Badge */}
      {rank && !isCandidate && (
        <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded-full">
          #{rank}
        </span>
      )}

      {loadindHiringStatus && <BarLoader width={"100%"} color='#36d7b7' />}

      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}

          <Download
            size={18}
            className='bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer'
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">

        {/* 🔥 AI SCORE */}
        <div className="text-lg font-semibold">
          🔥 Match Score: {score}%
        </div>

        {/* 🧠 AI FEEDBACK */}
        {application?.ai_feedback && (
          <div className="text-sm text-gray-600">
            {application.ai_feedback}
          </div>
        )}

        {/* ✅ MATCHED SKILLS */}
        {application?.matched_skills?.length > 0 && (
          <div className="text-sm">
            <span className="font-semibold text-green-600">✅ Matched:</span>{" "}
            {application.matched_skills.join(", ")}
          </div>
        )}

        {/* ❌ MISSING SKILLS */}
        {application?.missing_skills?.length > 0 && (
          <div className="text-sm">
            <span className="font-semibold text-red-600">❌ Missing:</span>{" "}
            {application.missing_skills.join(", ")}
          </div>
        )}

        <hr />

        <div className='flex flex-col md:flex-row justify-between'>
          <div className='flex gap-2 items-center'>
            <BriefcaseBusiness size={15} />
            {application?.experience} years
          </div>

          <div className='flex gap-2 items-center'>
            <Boxes size={15} />
            Skills: {application?.skills}
          </div>

          <div className='flex gap-2 items-center'>
            <School size={15} />
            {application?.education}
          </div>
        </div>

      </CardContent>

      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>

        {isCandidate ? (
          <span className='capitalize font-bold'>
            Status: {application?.status}
          </span>
        ) : (
          <Select onValueChange={handleStatusChange} defaultValue={application?.status}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interviewing">Interviewing</SelectItem>
              <SelectItem value="Hired">Hired</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>

    </Card>
  )
}

export default ApplicationCard