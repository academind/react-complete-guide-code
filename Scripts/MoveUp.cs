using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MoveUp : MonoBehaviour {
    
	//move up using this speed
	public float speed;
	
	void Update(){
		transform.Translate(Vector3.up * Time.deltaTime * speed);
	}
}
