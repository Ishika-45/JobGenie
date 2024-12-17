import { getCompanies } from "@/api/apiCompanies"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import useFetch from "@/hooks/use-fetch"
import { useUser } from "@clerk/clerk-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { State } from "country-state-city"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { BarLoader } from "react-spinners"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
})

const JobPost = () => {

  const { isLoaded, user } = useUser();

  const { register, control, handleSubmit, formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  })

  const { fn: fnCompanies, data: companies, loading: loadingCompanies, } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>

      <form className="flex flex-col gap-4 p-4 pb-0">
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (<p className="text-red-500">{errors.description.message}</p>)}

        <div className="flex gap-4 items-center">
          <Select
          // value={location} 
          // onValueChange={(value) => setLocation(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {State.getStatesOfCountry("IN").map(({ name }) => {
                  return (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  );
                })}

              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
          // value={company_id} onValueChange={(value) => setCompany_id(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* {companies.map(({ name,id }) => {
                       return (
                         <SelectItem key={name} value={id}>{name}</SelectItem>
                       );
                     })} */}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Add company drawer */}
        </div>
      </form>


    </div>

  )
}

export default JobPost



