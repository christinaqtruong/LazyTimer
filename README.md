# LazyTimer
The one-stop timer for interval training. Just set the intervals and start working out. This app allows the user to set two timers that switch back and forth automatically, allowing them to transition seamlessly between workout and rest periods during interval training without touching the timer. 

https://christinaqtruong.github.io/LazyTimer/

#Collaborators
Christina Truong


#Technologies
- Firebase to store and retrieve real-time data
- Bootstrap
- Moment.js for time conversions
- jQuery

#Development Process
- Goals:
    - START initiates countdown of the workout timer and subsequently the rest timer
    - RESET resets the timers back to the initial user inputs
    - STOP pauses the timer but does not reset the count
    - Enable user to input a time and have it display on the screen as minutes and seconds
    - Count down function starts decrementing the workout timer first, and moves onto the rest timer once the workout timer hits zero. Once the rest timer hits zero, both timers reset and start automatically, beginning with the workout timer.
    - No user input will automatically set to the previous interval used. 