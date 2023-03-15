using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Ball : MonoBehaviour {
	
	public Rigidbody rb;
	public GameObject ballEffect;
	public float offset;
	public Animator circle;
	public GameObject flames;
	public Material flameMat;
	public Animator anim;
	public GameObject brokenFloor;
	public GameObject wrongSideEffect;
	
	[HideInInspector]
	public bool inactive;
	
	bool playerHit;
	
    void Start(){
		flames.SetActive(false);
    }

    void Update(){
		//pause the circle indicator whenever the ball floats in a fixed position
        if(circle.GetBool("Paused") != rb.isKinematic)
			circle.SetBool("Paused", rb.isKinematic);
    }
	
	//on collision, check what we hit and show an effect on the ground
	void OnCollisionEnter(Collision other){
		if(!other.gameObject.CompareTag("Ground"))
			return;
		
		if(flames.activeSelf){
			Instantiate(brokenFloor, transform.position - Vector3.up * offset * 4, brokenFloor.transform.rotation);
			
			GameObject.FindObjectOfType<GameManager>().FireBall();
			
			Destroy(gameObject);
		}
		
		if(inactive)
			return;
		
		if(playerHit && transform.position.z > 3.75f){
			Out();
			
			return;
		}
		
		Instantiate(ballEffect, transform.position - Vector3.up * offset, ballEffect.transform.rotation);
	}
	
	//set the last hit to player/opponent (to remember who hit the ball when the ball is out)
	public void SetLastHit(bool player){
		this.playerHit = player;
	}
	
	//retrieve the last hit info
	public bool GetLastHit(){
		return this.playerHit;
	}
	
	//show the effect and destroy ball
	void Out(){
		Instantiate(wrongSideEffect, transform.position - Vector3.up * offset, wrongSideEffect.transform.rotation);
		
		GameObject.FindObjectOfType<GameManager>().Out();
		
		Destroy(gameObject);
	}
	
	//show flames on the ball
	public void Flames(){
		flames.SetActive(true);
		GetComponent<Renderer>().material = flameMat;
		circle.gameObject.SetActive(false);
		anim.SetTrigger("Grow");
	}
}
