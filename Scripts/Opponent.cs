using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class Opponent : MonoBehaviour {
	
	public float speed;
	public float turnSpeed;
	public Animator anim;
	public Transform head;
	public Transform lookAt;
	public ParticleSystem moveParticles;
	public Transform ball;
	public Animator arrow;

	public float force;
	public float upForce;
	public Transform player;
	public float moveRange;
	public Transform servePoint;
	public AudioSource hitAudio;
	public RandomPitch randomPitch;
	
	public bool notRotating;
	
	//directly follow ball rather then using the target position
	public bool followBall;
	
	Vector3 target;
	
	bool right;
	bool moving;
	
	bool justHit;
	
	float lastDist;
	Vector3 serveStart;
	
	float rotation;
	
    void Start(){
		moveParticles.Stop();
		serveStart = servePoint.position;
    }

    void Update(){
		//check if character should move
		Move();
    }
	
	void LateUpdate(){
		//look at the opponent
		head.LookAt(lookAt.position);
		
		//keep the serve position in the same place after moving bones
		Vector3 pos = serveStart;
		pos.x = transform.position.x;
		servePoint.position = pos;
	}
	
	void Move(){
		//either move to the target, or directly follow the ball x position
		if(target == Vector3.zero)
			return;
		
		float dist = Vector3.Distance(transform.position, target);
		moving = dist > 0.1f;
		
		if(moving){
			if(!followBall || ball == null){
				transform.position = Vector3.MoveTowards(transform.position, target, Time.deltaTime * speed);
			}
			else{
				Vector3 pos = transform.position;
				bool move = ball.GetComponent<Ball>().GetLastHit();
				Vector3 ballTarget = move ? new Vector3(ball.position.x, pos.y, pos.z) : pos;
				transform.position = Vector3.MoveTowards(transform.position, ballTarget, Time.deltaTime * speed);
			}

			right = target.x > transform.position.x;
		}
		
		if(anim.GetBool("Right") != right)
			anim.SetBool("Right", right);
		
		if(!moving){
			rotation = 0;
			
			if(moveParticles.isPlaying)
				moveParticles.Stop();
		}
		else{
			if(right){
				rotation = 91;
			}
			else{
				rotation = -90;
			}
			
			if(!moveParticles.isPlaying)
				moveParticles.Play();
		}
		
		//update the animator value to display the correct animation
		anim.SetBool("Moving", moving);
		
		if(notRotating)
			return;
		
		//rotate character based on movement
		Vector3 rot = transform.eulerAngles;
		rot.y = rotation;
		
		transform.rotation = Quaternion.Slerp(transform.rotation, Quaternion.Euler(rot), Time.deltaTime * turnSpeed);
	}
	
	void OnTriggerEnter(Collider other){
		//shoot the ball on trigger enter (when ball enters the opponent box)
		if(!other.gameObject.CompareTag("Ball") || other.gameObject.GetComponent<Ball>().inactive || justHit)
			return;
		
		float xDistance = Mathf.Abs(transform.position.x - other.gameObject.transform.position.x);
		
		if(xDistance > 1.3f){
			if(Random.Range(0, 2) == 0)
				anim.SetTrigger("Hit right");
			
			return;
		}
		
		StartCoroutine(JustHit());
		
		anim.SetTrigger("Hit right");
		HitBall(false, null);
		
		Target targetController = GetComponentInChildren<Target>();
		
		if(targetController != null){
			targetController.Hit();
			
			GameObject.FindObjectOfType<GameManager>().AddBonus();
		}
	}
	
	//shoot the ball in a random direction and update the ball and the player
	public void HitBall(bool noFlame, Transform spawnPosition){
		randomPitch.Set();
		hitAudio.Play();
		
		Vector3 random = new Vector3(Random.Range(-moveRange, moveRange), 0, player.position.z);
			
		Rigidbody rb = ball.GetComponent<Rigidbody>();
		Ball ballScript = ball.GetComponent<Ball>();
		
		if(ballScript.flames.activeSelf && !noFlame)
			return;
			
		ballScript.SetLastHit(false);
		
		Vector3 direction = (random - transform.position).normalized;
		
		player.GetComponent<Player>().SetTarget(random);
		
		ball.position = spawnPosition == null ? servePoint.position : spawnPosition.position;
		
		rb.velocity = direction * force + Vector3.up * upForce;
	}
	
	//make sure we don't hit twice at the same time
	public IEnumerator JustHit(){
		justHit = true;
		
		yield return new WaitForSeconds(1f);
		
		justHit = false;
	}
	
	//set move target
	public void SetTarget(Vector3 pos){
		this.target = pos;
	}
	
	//play the arrow animation
	public void TriggerArrow(){
		arrow.SetTrigger("Play");
	}
}
