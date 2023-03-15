using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RandomForce : MonoBehaviour {
    
	//base force
	public float force;
	
	void Start(){
		//randomize force
		force *= Random.Range(.7f, 1.4f);
		
		//get random direction
		Vector3 dir = new Vector3(GetRandom(), GetRandom(), GetRandom());
		
		//add force
		GetComponent<Rigidbody>().AddForce(dir * force);
	}
	
	//returns random value
	float GetRandom(){
		return Random.Range(-1f, 1f);
	}
}
