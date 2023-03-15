using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RotateReferee : MonoBehaviour {
    
	void Update(){
		//keep looking at the ball the whole time
		LookAtBall();
	}
	
	void LookAtBall(){
		//get the active ball
		Ball[] balls = GameObject.FindObjectsOfType<Ball>();
		Transform ball = null;
		
		for(int i = 0; i < balls.Length; i++){
			if(!balls[i].inactive)
				ball = balls[i].transform;
		}
		
		if(ball == null)
			return;
		
		//only use x and z position and rotate towards the ball position
		Vector3 ballPos = ball.position;
		ballPos.y = transform.position.y;
		
		transform.LookAt(ballPos);
	}
}
