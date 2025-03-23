use num_bigint::BigUint;
use num_traits::Zero;
use sha2::{Digest as Sha2Digest, Sha512};

use super::{srp_group::N_HEX, utils::hex_to_biguint};

pub struct DigestWrapper {
    hasher: Sha512,
}

impl DigestWrapper {
    pub fn new() -> Self {
        Self {
            hasher: Sha512::new(),
        }
    }
}

pub trait Digest {
    fn get_digest_size(&self) -> usize;
    fn block_update(&mut self, data: &[u8]);
    fn update(&mut self, byte: u8);
    fn do_final(&mut self, output: &mut [u8]);
}

impl Digest for DigestWrapper {
    fn get_digest_size(&self) -> usize {
        64 // SHA-512 produces 64 bytes (512 bits)
    }

    fn block_update(&mut self, data: &[u8]) {
        self.hasher.update(data);
    }

    fn update(&mut self, byte: u8) {
        self.hasher.update(&[byte]);
    }

    fn do_final(&mut self, output: &mut [u8]) {
        let result = self.hasher.clone().finalize();
        output[..result.len()].copy_from_slice(&result);
        self.hasher = Sha512::new();
    }
}

pub fn calculate_x<D: Digest>(
    digest: &mut D,
    _n: &BigUint,
    salt: &[u8],
    identity: &[u8],
    password: &[u8],
) -> BigUint {
    let digest_size = digest.get_digest_size();
    let mut output = vec![0u8; digest_size];

    digest.block_update(identity);
    digest.update(b':');
    digest.block_update(password);
    digest.do_final(&mut output);

    digest.block_update(salt);
    digest.block_update(&output);
    digest.do_final(&mut output);

    BigUint::from_bytes_be(&output)
}

pub fn calculate_secret(
    priv_a: &BigUint,
    pub_a: &BigUint,
    server_b: &str,
    x: &BigUint,
) -> Result<String, String> {
    let n = hex_to_biguint(N_HEX);
    let g = BigUint::from(2u8);

    let b = validate_public_value(&n, &hex_to_biguint(server_b))?;

    let mut digest = DigestWrapper::new();
    let u = calculate_u(&mut digest, &n, pub_a, &b);

    let s = calculate_s(priv_a, &b, &n, &g, x, &u);

    Ok(s.to_str_radix(16))
}

fn validate_public_value(n: &BigUint, val: &BigUint) -> Result<BigUint, String> {
    let val = val % n;

    if val == BigUint::from(0u8) {
        return Err("Invalid public value: 0".to_string());
    }

    Ok(val)
}

fn calculate_u(digest: &mut DigestWrapper, n: &BigUint, a: &BigUint, b: &BigUint) -> BigUint {
    hash_padded_pair(digest, n, a, b)
}

fn hash_padded_pair(
    digest: &mut DigestWrapper,
    n: &BigUint,
    n1: &BigUint,
    n2: &BigUint,
) -> BigUint {
    let padded_length = (n.bits() as usize + 7) / 8;

    let n1_bytes = n1.to_bytes_be();
    let mut padded = vec![0u8; padded_length];
    if n1_bytes.len() <= padded_length {
        padded[padded_length - n1_bytes.len()..].copy_from_slice(&n1_bytes);
    } else {
        padded.copy_from_slice(&n1_bytes[n1_bytes.len() - padded_length..]);
    }
    digest.block_update(&padded);

    let n2_bytes = n2.to_bytes_be();
    let mut padded = vec![0u8; padded_length];
    if n2_bytes.len() <= padded_length {
        padded[padded_length - n2_bytes.len()..].copy_from_slice(&n2_bytes);
    } else {
        padded.copy_from_slice(&n2_bytes[n2_bytes.len() - padded_length..]);
    }
    digest.block_update(&padded);

    let digest_size = digest.get_digest_size();
    let mut output = vec![0u8; digest_size];
    digest.do_final(&mut output);

    BigUint::from_bytes_be(&output)
}

fn calculate_k(digest: &mut DigestWrapper, n: &BigUint, g: &BigUint) -> BigUint {
    hash_padded_pair(digest, n, n, g)
}

fn calculate_s(
    priv_a: &BigUint,
    b: &BigUint,
    n: &BigUint,
    g: &BigUint,
    x: &BigUint,
    u: &BigUint,
) -> BigUint {
    let mut digest = DigestWrapper::new();
    let k = calculate_k(&mut digest, n, g);

    let exp = u * x + priv_a;

    let tmp = (g.modpow(x, n) * &k) % n;

    let diff = if b >= &tmp {
        (b - &tmp) % n
    } else {
        (b + n - &tmp) % n
    };

    diff.modpow(&exp, n)
}

pub fn calculate_client_evidence(
    pub_a: &BigUint,
    server_b: &str,
    secret: &str,
) -> Result<String, String> {
    if pub_a.is_zero() {
        return Err("Missing public key A for M1 calculation".to_string());
    }

    let b = hex_to_biguint(server_b);
    if b.is_zero() {
        return Err("Missing server public key B for M1 calculation".to_string());
    }

    let s = hex_to_biguint(secret);
    if s.is_zero() {
        return Err("Missing shared secret S for M1 calculation".to_string());
    }

    let m1 = calculate_m1(&pub_a, &b, &s);

    Ok(m1.to_str_radix(16))
}

fn calculate_m1(a: &BigUint, b: &BigUint, s: &BigUint) -> BigUint {
    let n = hex_to_biguint(N_HEX);
    let mut digest = DigestWrapper::new();

    hash_padded_triplet(&mut digest, &n, a, b, s)
}

fn hash_padded_triplet(
    digest: &mut DigestWrapper,
    n: &BigUint,
    n1: &BigUint,
    n2: &BigUint,
    n3: &BigUint,
) -> BigUint {
    let padded_length = (n.bits() as usize + 7) / 8;

    let n1_bytes = n1.to_bytes_be();
    let mut padded = vec![0u8; padded_length];
    if n1_bytes.len() <= padded_length {
        padded[padded_length - n1_bytes.len()..].copy_from_slice(&n1_bytes);
    } else {
        padded.copy_from_slice(&n1_bytes[n1_bytes.len() - padded_length..]);
    }
    digest.block_update(&padded);

    let n2_bytes = n2.to_bytes_be();
    let mut padded = vec![0u8; padded_length];
    if n2_bytes.len() <= padded_length {
        padded[padded_length - n2_bytes.len()..].copy_from_slice(&n2_bytes);
    } else {
        padded.copy_from_slice(&n2_bytes[n2_bytes.len() - padded_length..]);
    }
    digest.block_update(&padded);

    let n3_bytes = n3.to_bytes_be();
    let mut padded = vec![0u8; padded_length];
    if n3_bytes.len() <= padded_length {
        padded[padded_length - n3_bytes.len()..].copy_from_slice(&n3_bytes);
    } else {
        padded.copy_from_slice(&n3_bytes[n3_bytes.len() - padded_length..]);
    }
    digest.block_update(&padded);

    let digest_size = digest.get_digest_size();
    let mut output = vec![0u8; digest_size];
    digest.do_final(&mut output);

    BigUint::from_bytes_be(&output)
}
