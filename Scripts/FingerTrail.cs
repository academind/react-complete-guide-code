using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FingerTrail : MonoBehaviour {
	
	public Transform[] sprites;
	
	int index;
	
	void Start(){
		Disable();
	}
    
	//update UI sprites to track the finger position
	void Update(){
		Vector3 pos = Input.mousePosition;
		
		if(Input.GetMouseButton(0)){
			if(index < sprites.Length)
				sprites[index].gameObject.SetActive(true);
			
			for(int i = sprites.Length - 1; i >= 0; i--){
				if(i == 0){
					sprites[i].position = pos;
					continue;
				}
					
				if(sprites[i].gameObject.activeSelf)
					sprites[i].position = sprites[i - 1].position;
			}
			
			index++;
		}
		else if(Input.GetMouseButtonUp(0)){
			index = 0;
			
			Disable();
		}
	}
	
	//disable the finger trail
	void Disable(){
		for(int i = 0; i < sprites.Length; i++){
			sprites[i].gameObject.SetActive(false);
		}
	}
}
