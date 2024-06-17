'use client';

import React, { useCallback, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { api } from '~/trpc/react';
import { convertStringtoDate } from '~/app/_components/createLog';
import { nanoid } from 'nanoid';
import { type CellValueChangedEvent } from 'ag-grid-community';

type RepsAndWeight = {
  reps: number; 
  weight: number;
}

type RowData = {
  id: string; 
  date: Date;
  exercise: string;
  repsAndWeight: RepsAndWeight[];
}

export const LiftingLog = () => {
  const todaysDate = new Date();
  const {data: liftingLogData, isLoading, isError} = api.liftingLog.getAll.useQuery();
  const createLiftingLog = api.liftingLog.createWorkout.useMutation({});
  const updateLiftingLog = api.liftingLog.updateWorkout.useMutation({});
  const deleteExercise = api.liftingLog.deleteExercise.useMutation({});

  const [rowData, setRowData] = useState<RowData[]>();
  const gridRef = useRef<AgGridReact>(null);

  const defaultWorkoutData = liftingLogData && liftingLogData.length > 0 ? liftingLogData.map((log) => ({
    date: log.date,
    exercise: log.exercise,
    repsAndWeight: [{reps: log.reps, weight: log.weight}],
    id: log.workoutLogId as string, 
})): [];


  const [columnDefs] = useState([
    { headerName: 'Date', field: 'date', editable: true, cellDataType: 'date' },
    { headerName: 'Exercise', field: 'exercise', editable: true },
    { headerName: 'Reps & Weight', 
      children: [
        {columnGroupShow: 'open', headerName: 'Reps', field: 'reps', editable: true, type: 'numericColumn' },
        {columnGroupShow: 'open', headerName: 'Weight', field: 'weight', editable: true, type: 'numericColumn' },
      ],
    }
  ]);


  const onRemoveSelected = useCallback(async () => {
    const selectedData = gridRef.current!.api.getSelectedRows();
    const deletedID = selectedData[0]?.id;
    
    await deleteExercise.mutateAsync({id: deletedID });
    
    gridRef.current!.api.applyTransaction({
      remove: selectedData,
    })!

    const rowData = gridRef?.current?.props?.rowData; 
    const updatedRowData = rowData?.filter((row) => {
      if ((row?.id !== deletedID)) {
        return row
      }
    });

    setRowData(updatedRowData);
  }, [deleteExercise]);

  if (isLoading) {
    return <div>Is Loading</div> 
  } else 
  if (isError) {
    return <div>There Has Been An Error Loading This Page</div>
  }

  const addNewRow = async () => {
    const rowId = nanoid();
    //should clean up maybe the prisma table on the table to fix this 
    //either nest, or in the queries convert repsAndWeight into the right variables. 
    const newEmptyRow = { id: rowId, date: convertStringtoDate(todaysDate), exercise: '', reps: 0, weight: 0};
    const newRowData =  {id: rowId, date: todaysDate, exercise: '', repsAndWeight: [{reps: 0, weight: 0}]};
    const newRow = await createLiftingLog.mutateAsync({
      ...newEmptyRow,
    });
    if (!defaultWorkoutData) {
      return;
    }
    const oldRowData = rowData ? rowData : defaultWorkoutData;
    setRowData([ ...oldRowData, { ...newRowData }]);
  };

  const onCellValueChange = async (params: CellValueChangedEvent<RowData>) => {
    const rowsToUpdate = rowData ? rowData : defaultWorkoutData;
    const updatedRowData = rowsToUpdate?.map((row, index) =>
      {
        return index === params.node.rowIndex ? { ...row, [params.colDef.field]: params.newValue } : row
      }
    ) ;

    setRowData(updatedRowData);

    const updatedRow = {
      id: params.data.id,
      date: convertStringtoDate(params.data.date),
      exercise: params.data.exercise,
      reps: params?.data?.repsAndWeight?.[0]?.reps ? Number(params?.data?.repsAndWeight?.[0]?.reps): 0,
      weight: params?.data?.repsAndWeight?.[0]?.reps ? Number(params?.data?.repsAndWeight?.[0]?.weight): 0,
    };

    if(updatedRow.id) {
      updateLiftingLog.mutate(updatedRow);
    }
  }

  return (
      <div className="h-full">
        <div className='flex flex-row align-middle justify-center gap-20 mb-4'> 
        <button className="rounded-full bg-orange-400 px-10 py-3 font-semibold" onClick={addNewRow}>
          Add New Row
        </button>
        <button className="rounded-full bg-orange-400 px-10 py-3 font-semibold" onClick={onRemoveSelected}>
          Delete A Row
        </button>
        </div>
        <div className='flex flex-row align-middle justify-center w-full h-full'> 
          <div className="ag-theme-alpine overflow-y-scroll h-[75lvh] max-h-[700px]" style={{width: '50%'}}>
            <AgGridReact
              rowData={rowData ?? defaultWorkoutData}
              columnDefs={columnDefs}
              defaultColDef={{
                editable: true,
                flex: 1,
                resizable: true,
              }}
              onCellValueChanged={onCellValueChange}
              suppressScrollOnNewData={true}
              rowSelection='multiple'
              ref={gridRef}
            />
          </div>
        </div>
      </div>
  );
};
