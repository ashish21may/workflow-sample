import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../common'
import { WorkflowDiagram } from './WorkflowDiagram'
import { NodeConstraints } from "@syncfusion/ej2-react-diagrams"
import * as Logo from '../assets/ServiceNow.logo.jpg'


export const WorkflowDiagramGenerator = ({ type, workflowId, onNodeClick, isView = false, onStatusChange }) => {

  const [workflowType, setWorkflowType] = useState({})
  const [workflowSteps, setWorkflowSteps] = useState({})
  const [workflowStatus, setWorkflowStatus] = useState('In Progress')
  const [historyWithStages, setHistoryWithStages] = useState([])
  const [workflowHistory, setWorkflowHistory] = useState({})
  const [workflows] = useLocalStorage('ws:workflows', [])
  const green = '#61FF33' // color code for completed
  const grey = '#E5ECE2'  // color code for In progress
  const red = '#FA2116'   // color code for rejected
  const white = 'white'

  useEffect(() => {
    //get workflow information from workflowId
    const fetchWorkflow = async () => {
        const response = await fetch(`http://ec2-3-129-92-198.us-east-2.compute.amazonaws.com:8888/workflow/history/${workflowId}`, {
            method: 'GET'
        })
        if(response.ok){
            const workflow = await response.json()
            console.log(workflow)
            setWorkflowHistory(workflow)
        }else{
            console.error('Not able to get workflow details')
        }
    }

    if(isView){
      console.log('fetc')
      fetchWorkflow()
    }
  }, [workflowId, isView])

  useEffect(() => {
    if(workflowHistory && workflowHistory.history){
      console.log('workflowHistory', workflowHistory)
      workflowHistory.history.forEach(({stage, state}) => {
        if(stage === 'Workflow' && state === 'COMPLETED'){
          onStatusChange && onStatusChange('Completed')
          setWorkflowType(prevState=>{
            const updatedState = {...workflowSteps}
            updatedState.nodes[3].shape = {
              type: 'Image',
              source: Logo,
              scale: 'Meet'
            }
            updatedState.nodes[3].annotations[0].content = ''
            return updatedState
          })
        }
      })

      const historyWithStages = workflowHistory.history.filter(({eventType}) => eventType === 'WorkflowExecutionSignaled')
      setHistoryWithStages(historyWithStages)
    }
  }, [workflowHistory])

  useEffect(() => {
    console.log(type)
    if (type && type.toLowerCase() === 'sequential') {
      const sequential = {
        nodes: [
          {
            id: "node1",
            height: 100,
            width: 100,
            offsetX: 200,
            offsetY: 100,
            style: {
              fill: grey,
            },
            annotations: [
              {
                content: "Deployment step"
              },
              {
                stepType: "documentUpload",
                stepNumber: "one"
              }
            ]
            //   shape: {
            //     type: 'HTML',
            //   }
          },
          {
            id: "node2",
            height: 100,
            width: 100,
            offsetX: 400,
            offsetY: 100,
            style: {
              fill: grey,
            },
            annotations: [
              {
                content: "Review step"
              },
              {
                stepType: "singleReview",
                stepNumber: "two"
              }
            ]
          },
          {
            id: "node3",
            height: 100,
            width: 100,
            offsetX: 600,
            offsetY: 100,
            style: {
              fill: grey,
            },
            annotations: [
              {
                content: "Review step"
              },
              {
                stepType: "singleReview",
                stepNumber: "three"
              }
            ]
          },
          {
            id: "node4",
            height: 100,
            width: 100,
            offsetX: 800,
            offsetY: 100,
            style: {
              fill: grey,
            },
            annotations: [
              {
                content: 'Service Now Ticket Creation'
              },
              {
                stepType: "serviceNow",
                stepNumber: "four"
              }
            ]
          }
        ],
        connectors: [
          {
            id: "connector1",
            sourceID: "node1",
            targetID: "node2"
          },
          {
            id: "connector2",
            sourceID: "node2",
            targetID: "node3"
          },
          {
            id: "connector3",
            sourceID: "node3",
            targetID: "node4"
          } 
        ]
      }
      if(isView){
        setWorkflowSteps(sequential)
      }else{
        console.log('seq', sequential)
        setWorkflowType(sequential)
      }

    } else if (type.toLowerCase() === 'parallel') {
      const parallel = {
        nodes: [
          {
            id: "node1",
            height: 100,
            width: 100,
            offsetX: 200,
            offsetY: 300,
            style: {
              fill: grey,
            },
            annotations: [
              {
                content: "Deployment step"
              },
              {
                stepType: "documentUpload",
                stepNumber: "one"
              }
            ]
            //   shape: {
            //     type: 'HTML',
            //   }
          },
          {
            id: "node2",
            height: 100,
            width: 100,
            offsetX: 400,
            offsetY: 200,
            style: {
              fill: grey,
            },
            annotations: [
              {
                content: "Review Step"
              },
              {
                stepType: "singleReview",
                stepNumber: "two"
              }
            ]
          },
          {
            id: "node3",
            height: 100,
            width: 100,
            offsetX: 400,
            offsetY: 400,
            style: {
              fill: grey,
            },
            annotations: [
              {
                content: "Review Step"
              },
              {
                stepType: "singleReview",
                stepNumber: "three"
              }
            ]
          },
          {
            id: "node4",
            height: 100,
            width: 100,
            offsetX: 600,
            offsetY: 300,
            style: {
              fill: grey,
            },
            annotations: [
              {
                content: "Create ServiceNow ticket"
              },
              {
                stepType: "serviceNow",
                stepNumber: "four"
              }
            ]
          }
        ],
        connectors: [
          {
            id: "connector1",
            sourceID: "node1",
            targetID: "node2"
          },
          {
            id: "connector2",
            sourceID: "node1",
            targetID: "node3"
          },
          {
            id: "connector3",
            sourceID: "node2",
            targetID: "node4"
          },
          {
            id: "connector4",
            sourceID: "node3",
            targetID: "node4"
          },
        ]
      }
      if(isView){
        setWorkflowSteps(parallel)
      }else{
        setWorkflowType(parallel)
      }

    }
  }, [type, isView])

  useEffect(() => {
    // We might change the color of the steps of selected workflow
    // in this useeffect. Though we might also take another way.

    const selectedWorkflow = workflows.filter(item => item.id !== workflowId)
    console.log('historyWithStages', historyWithStages, selectedWorkflow)

    if (selectedWorkflow.length && (type.toLowerCase() === 'sequential' || type.toLowerCase() === 'parallel')){
        if(historyWithStages && !historyWithStages.length){
            setWorkflowType({...workflowSteps})
        }
      for(let i=0; i<historyWithStages.length;i++){
        switch(historyWithStages[i].state){
          case 'APPROVED':
            setWorkflowType(prevState=>{
              const updatedState = {...workflowSteps}
              updatedState.nodes[i].style.fill = green
              console.log('filled wit green')
              return updatedState
            })
            break
          case 'REJECTED':
            setWorkflowType(prevState=>{
              const updatedState = {...workflowSteps}
              updatedState.nodes[i].style.fill = red
              return updatedState
            })
            break
          case null:
            setWorkflowType(prevState=>{
              const updatedState = {...workflowSteps}
              updatedState.nodes[i].style.fill = white
              return updatedState
            })
            break
          default:
            return null
        }
      }
    } 
  }, [workflowId, type, historyWithStages])

  return (
    <>
      {
        workflowType && workflowType.nodes && workflowType.nodes.length && <WorkflowDiagram workflowType={workflowType} onNodeClick={onNodeClick} onStatusChange={onStatusChange} />
      }
    </>

  )
}
