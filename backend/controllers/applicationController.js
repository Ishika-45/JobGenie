import fs from "fs";
import { createSupabaseClient } from "../services/supabaseService.js";
import { parseResume } from "../utils/parseResume.js";
import { analyzeResume } from "../services/aiService.js";

export const applyJob = async (req, res) => {
  try {
    const { token, jobData } = req.body;
    const parsedData = JSON.parse(jobData);

    const supabase = createSupabaseClient(token);

    // 📁 Read file
    const fileBuffer = fs.readFileSync(req.file.path);
    const fileName = `resume-${Date.now()}-${parsedData.candidate_id}`;

    // ☁️ Upload to Supabase
    await supabase.storage
      .from("resumes")
      .upload(fileName, fileBuffer);

    const resumeUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/resumes/${fileName}`;

    // 🧠 STEP 1: Extract text
    const resumeText = await parseResume(req.file.path);

    // 🧠 STEP 2: AI ANALYSIS (FREE ENGINE)
    const aiResult = analyzeResume(
      resumeText,
      parsedData.job_description || ""
    );

    console.log("AI RESULT:", aiResult); // debug

    // 💾 STEP 3: Save to DB
    const { data, error } = await supabase
      .from("applications")
      .insert([
        {
          ...parsedData,
          resume: resumeUrl,
          ai_score: aiResult.score,
          matched_skills: aiResult.matchedSkills,
          missing_skills: aiResult.missingSkills,
          ai_feedback: aiResult.summary,
        },
      ])
      .select();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Application failed" });
  }
};