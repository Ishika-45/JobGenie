import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
    try {
        const formData = new FormData();

        formData.append("resume", jobData.resume);
        formData.append("jobData", JSON.stringify(jobData));
        formData.append("token", token);

        const res = await fetch("http://localhost:5000/api/apply", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        return data;

    } catch (error) {
        console.error("Error applying:", error);
        return null;
    }
}

export async function updateApplicationStatus(token,{job_id} , status) {
    const supabase = await supabaseClient(token);

        const { data, error } = await supabase
        .from("applications")
        .update({status})
        .eq("job_id" , job_id)
        .select();

        if (error || data.length === 0) {
            console.error("Error Updating Application Status: ", error);
            return null;
        }
        return data;

}

export async function getApplications(token, { user_id }) {
    const supabase = await supabaseClient(token);

        const { data, error } = await supabase
        .from("applications")
        .select("*, job:jobs(title, company:companies(name))")
        .eq("candidate_id" , user_id)
        

        if (error) {
            console.error("Error Fetching Applications: ", error);
            return null;
        }
        return data;

}