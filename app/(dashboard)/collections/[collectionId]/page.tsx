"use client"

import { useEffect, useState, use } from "react";

import Loader from "@/components/custom ui/Loader"
import CollectionForm from "@/components/collections/CollectionForm"

const CollectionDetails = (props: { params: Promise<{ collectionId: string }>}) => {
  const params = use(props.params);
  const [loading, setLoading] = useState(true)
  const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)

  const getCollectionDetails = async () => {
    try { 
      const res = await fetch(`/api/collections/${params.collectionId}`, {
        method: "GET"
      })
      const data = await res.json()
      setCollectionDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[collectionId_GET]", err)
    }
  }

  useEffect(() => {
    getCollectionDetails()
  }, )

  return loading ? <Loader /> : (
    <CollectionForm initialData={collectionDetails}/>
  )
}

export default CollectionDetails