'use client';

import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";


type inputType = {
    placeholder: string;
}

const convertStringtoDate = (dateString: string) => {
    const date = new Date(dateString);
    const isoDateString = date.toISOString();
    return isoDateString;
}

export const CreateLog = () => {
    const workoutDateRef = useRef<HTMLInputElement>(null);
    const exerciseRef = useRef<HTMLInputElement>(null);
    const repsRef = useRef<HTMLInputElement>(null);

    const createLift = api.liftingLog.submitLift.useMutation({});


    const submitToLiftingLog = () => {
        const workoutDate = workoutDateRef?.current?.value ? convertStringtoDate(workoutDateRef?.current?.value) : new Date().toString();
        // const workoutDate = new Date(`${year}-${month}-${day}`)
        const exercise = exerciseRef?.current?.value;
        const reps = Number(repsRef?.current?.value);
        // const createdAt = new Date().getTime();
        console.log('workoutDate, exercise, reps', workoutDate, exercise, reps);
        if (workoutDate && exercise && reps) {
            createLift.mutate({workoutDate, exercise, reps});
        }
        
    }

    return (
        <>
            <form className="grid w-full" onSubmit={submitToLiftingLog}>
                <div className="my-3"  >
                    Workout Date:
                    <Input ref={workoutDateRef} type="text" placeholder="date" />
                </div>
                <div className="my-3">
                    Exercise: 
                    <Input ref={exerciseRef} type="text" placeholder="exercise" />
                </div>
                <div className="my-3">
                    Reps:
                    <Input ref={repsRef} type="number" placeholder="reps" />
                </div>
                <Button type="submit">Submit</Button>
            </form>
            {/* {showLatest ? 
            <div>
                {Object.entries(showLatest).map((key,value) => {
                    console.log('property', key, value);
                   return  <div key={'dupli'}> {key}{value}</div>
                })}
            </div> 
            : null} */}
        </>
    )
}
