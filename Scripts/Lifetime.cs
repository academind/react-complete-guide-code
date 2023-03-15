using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Lifetime : MonoBehaviour {
	
	public float lifetime;
	
    void Start(){
		//destroy object after the lifetime length (in seconds)
        Destroy(gameObject, lifetime);
    }
}
