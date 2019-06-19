# LazyTimer
The one-stop timer for interval training. Just set the intervals and start working out.

#Collaborators
Christina Truong

#Use Case
Interval training requires setting timers, which can cause athletes to lose a lot of momentum during their workouts. This app allows the user to set two timers that cycle automatically, allowing them to transition seamlessly between workout and rest periods during interval training without touching the timer. 

#User Stories
- utilize Firebase to store and retrieve real-time data

#Development Process
- Goals:
    - START initiates countdown of the workout timer and subsequently the rest timer
    - RESET resets the timers back to the initial user inputs
    - STOP pauses the timer but does not reset the count
    - Enable user to input a time and have it display on the screen as minutes and seconds
    - Count down function starts decrementing the workout timer first, and moves onto the rest timer once the workout timer hits zero. Once the rest timer hits zero, both timers reset and start automatically, beginning with the workout timer.
    - No user input will automatically set to the previous interval used. 