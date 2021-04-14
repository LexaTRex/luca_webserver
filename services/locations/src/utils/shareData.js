export const getIncompletedTransfers = transfers => {
  const contactedIncompleteTransfers = transfers.filter(
    transfer => !!transfer.contactedAt && !transfer.isCompleted
  );

  const incompletedTracingProcesses = contactedIncompleteTransfers.map(
    transfer => transfer.uuid
  );

  const filteredIncompletedTracingProcesses = incompletedTracingProcesses.filter(
    (item, index) => incompletedTracingProcesses.indexOf(item) === index
  );

  return filteredIncompletedTracingProcesses.map(tracingProcess => ({
    tracingProcessId: tracingProcess,
    healthDepartment: contactedIncompleteTransfers.find(
      transfer => transfer.uuid === tracingProcess
    ).departmentName,
    createdAt: contactedIncompleteTransfers.find(
      transfer => transfer.uuid === tracingProcess
    ).createdAt,
    transfers: contactedIncompleteTransfers.filter(
      transfer => transfer.uuid === tracingProcess
    ),
    timeSpan: contactedIncompleteTransfers.find(
      transfer => transfer.uuid === tracingProcess
    ).time,
  }));
};

export const getCompletedTransfers = transfers => {
  const completedTransfers = transfers.filter(transfer => transfer.isCompleted);

  const completedTracingProcesses = completedTransfers.map(
    transfer => transfer.uuid
  );

  const filteredCompletedTracingProcesses = completedTracingProcesses.filter(
    (item, index) => completedTracingProcesses.indexOf(item) === index
  );

  return filteredCompletedTracingProcesses
    .sort((tracingProcessA, tracingProcessB) =>
      tracingProcessA.createdAt > tracingProcessB ? 1 : -1
    )
    .map(tracingProcess => ({
      tracingProcessId: tracingProcess,
      healthDepartment: completedTransfers.find(
        transfer => transfer.uuid === tracingProcess
      ).departmentName,
      createdAt: completedTransfers.find(
        transfer => transfer.uuid === tracingProcess
      ).createdAt,
      transfers: completedTransfers.filter(
        transfer => transfer.uuid === tracingProcess
      ),
      timeSpan: completedTransfers.find(
        transfer => transfer.uuid === tracingProcess
      ).time,
    }));
};
