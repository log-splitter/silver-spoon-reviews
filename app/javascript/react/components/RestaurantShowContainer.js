import React, { useState, useEffect } from 'react'
import RestaurantShow from './RestaurantShow'
import ReviewTile from './ReviewTile'

const RestaurantShowContainer = props =>  {
  const [errors, setErrors] = useState(null)
  const [redirect, setRedirect] = useState(false)
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    neighborhood: "",
    phone: "",
    url: ""
  })
  const [restaurantReviews, setRestaurantReviews] = useState([])

  const restaurantId = props.match.params.id

  useEffect(()=> {
  fetch(`/api/v1/restaurants/${restaurantId}`, {
    credentials: "same-origin"
  })
  .then(response =>{
    if(response.ok) {
      return response
    } else {
      let errorMessage = `${response.status} (${response.statusText})`
        error = new Error(errorMessage)
      throw(error)
    }
  })
  .then(response => response.json())
  .then(parsedRestaurant => {
    setRestaurant(parsedRestaurant.restaurant)
    setRestaurantReviews(parsedRestaurant.restaurant.reviews)
  })
  .catch(error => console.error(`Error in fetch: ${errorMessage}`))
  }, [])

  const deleteRestaurant = (restaurant) =>  {
    if (window.confirm('Are you sure you would like to delete this restaurant?')) {
      fetch(`/api/v1/restaurants/${restaurantId}`, {
        credentials: "same-origin",
        method: 'DELETE',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        if(response.ok) {
          return response
        } else {
          let errorMessage = `${response.status} (${response.statusText})`,
          error = new Error(errorMessage);
          throw(error)
        }
      })
      .then(response => response.json())
      .then(body => {
        if (body.notification) {
          setRedirect(true)
        } else {
          setErrors(body.error)
        }
      })
      .catch(error => console.error(`Error in fetch: ${error.message}`))
    }
  }

  if (redirect) {
    return <Redirect to={'/restaurants'} />
  }

  const reviewsList = restaurantReviews.map(review => {
    return (
      <ReviewTile
        key={review.id}
        rating={review.rating}
        description={review.description}
      />
    )
  })

  return(
    <div>
      {errors}
      <RestaurantShow
        restaurant={restaurant}
        deleteRestaurant={deleteRestaurant}
      />
      {reviewsList}
    </div>
  )
}

export default RestaurantShowContainer
