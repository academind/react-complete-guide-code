using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CourtTrigger : MonoBehaviour {
    
	public GameManager manager;
	public bool net;
	
	//tell the game manager when the court sides or net are triggered
	void OnTriggerEnter(Collider other){
		if(!other.gameObject.CompareTag("Ball"))
			return;
		
		Ball ball = other.gameObject.GetComponent<Ball>();
		
		if(!ball.inactive)
			manager.CourtTriggered(net);
	}
}
