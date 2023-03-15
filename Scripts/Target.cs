using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Target : MonoBehaviour {
	
	//broken target effect
	public GameObject brokenTarget;
	
	public Animator anim;
    
	//on hit, show an animation and instantiate the broken target
	public void Hit(){
		anim.SetTrigger("Hit");
		
		Instantiate(brokenTarget, transform.position, brokenTarget.transform.rotation);
	}
}
