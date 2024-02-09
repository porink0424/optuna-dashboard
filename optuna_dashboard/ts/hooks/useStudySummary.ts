import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createNewStudyAPI, getStudySummariesAPI } from "../apiClient"
import { useEffect, useState } from "react"
import { useSnackbar } from "notistack"
import { AxiosError } from "axios"

export const useStudySummaries = () => {
    const queryClient = useQueryClient()
    const { enqueueSnackbar } = useSnackbar()
    const [reservedSuccessMessage, setReservedSuccessMessage] = useState<string | null>(null)

    const { data, isLoading, error } = useQuery<StudySummary[]>({
        queryKey: ["studySummary"],
        queryFn: () => getStudySummariesAPI(),
        staleTime: Infinity,
        gcTime: Infinity,
    })

    useEffect(() => {
        if (!isLoading && reservedSuccessMessage !== null) {
            enqueueSnackbar(reservedSuccessMessage, { variant: "success" })
            setReservedSuccessMessage(null)
        }
    }, [isLoading])

    useEffect(() => {
        if (error) {
            enqueueSnackbar(`Failed to fetch study list.`, {
                variant: "error",
              })
              console.log(error)
        }
    }, [error])

    const create = useMutation<
        StudySummary,
        AxiosError,
        {
            studyName: string,
            directions: StudyDirection[]
        }
    >({
        mutationFn: (variables) => createNewStudyAPI(variables.studyName, variables.directions),
        onSuccess: (_newStudySummary, variables) => {
            queryClient.invalidateQueries({queryKey: ["studySummary"]})
            setReservedSuccessMessage(`Success to create a study (study_name=${variables.studyName})`)
        },
        onError: (error, variables) => {
            enqueueSnackbar(`Failed to create a study (study_name=${variables.studyName})`, {
                variant: "error",
              })
              console.log(error)
        }
    })

    const reload = (successMessage?: string) => {
        if (successMessage) {
            setReservedSuccessMessage(successMessage)
        }
        queryClient.invalidateQueries({queryKey: ["studySummary"]})
    }

    return {
        studySummaries: data,
        isLoading,
        error,
        reload,
    }
}

export const useStudySummary = ({
    studyId
}: {
    studyId: number
}) => {
    const { studySummaries } = useStudySummaries()
    return studySummaries?.find((s) => s.study_id === studyId) || null
}