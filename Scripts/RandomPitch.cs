using System.Collections;
using System.Collections.Generic;
using UnityEngine;

//makes sounds more interesting by changing the pitch a bit every time
public class RandomPitch : MonoBehaviour {
	
    public float min;
	public float max;
	
	AudioSource source;
	
	void Start(){
		//get audio source
		source = GetComponent<AudioSource>();
	}
	
	public void Set(){
		//set random pitch
		source.pitch = Random.Range(min, max);
	}
}
